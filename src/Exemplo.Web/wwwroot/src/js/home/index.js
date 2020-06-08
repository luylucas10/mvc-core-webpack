/*
 * Módulo jQuery
 * 
 * Arquivo que contém os métodos utilizados na página que utiliza jQuery.
 */

// import o css específico
import "../../scss/home.scss";

// import das bibliotecas npm
import axios from "axios";
import $ from "jquery";
import "bootstrap";
import "jquery-validation";
import "jquery-validation-unobtrusive";
import 'bootstrap-table/dist/bootstrap-table.js';
import 'bootstrap-table/dist/locale/bootstrap-table-pt-BR.js'

// import das bibliotecas locais
import { scrollTop } from "../util";

// criação da view model da página, utilizando IIFE:
// https://medium.com/larimaza-pt/p%C3%ADlulas-de-javascript-express%C3%A3o-de-fun%C3%A7%C3%A3o-invocada-imediatamente-iife-7b2a2cee209f
// https://en.wikipedia.org/wiki/Immediately_invoked_function_expression
// https://desenvolvimentoparaweb.com/javascript/javascript-iife-conteiner-de-codigos/

const App = ((j) => {
    let searchUrl,
        createUrl,
        editUrl,
        deleteUrl,
        idInput,
        nomeInput,
        cpfInput,
        btnNew,
        btnSubmit,
        btnModalConfirm,
        table,
        form,
        modal,
        alert,
        messageTitle,
        message;

    const init = () => {
        searchUrl = j("#search-url").val();
        createUrl = j("#post-url").val();
        editUrl = j("#put-url").val();
        deleteUrl = j("#delete-url").val();
        idInput = j("#Id");
        nomeInput = j("#Nome");
        cpfInput = j("#Cpf");
        btnSubmit = j("#btnSubmit");
        btnNew = j("#btnNew");
        btnModalConfirm = j("#btnModalConfirm");
        table = j("#table");
        form = j("#form");
        modal = j("#modal");
        alert = j("#alert");
        messageTitle = j("#messageTitle");
        message = j("#message");
        initEvents();

    };

    const initEvents = () => {
        btnNew.on("click", () => clearFields());

        btnSubmit.on("click", e => {
            form.validate();
            if (form.valid()) {
                blockButtons();
                const obj = { id: Number(idInput.val()), nome: nomeInput.val(), cpf: cpfInput.val() };
                if (!obj.id || obj.id === 0)
                    axios.post(createUrl, obj)
                        .then(response => {
                            responseChecker(response);
                            clearFields();
                        })
                        .catch(response => {
                        })
                        .finally(() => {
                            enableButtons();
                        });
                else
                    axios
                        .put(`${editUrl}/${obj.id}`, obj).then(response => {
                            responseChecker(response);
                            clearFields();
                        })
                        .catch(response => {
                        })
                        .finally(() => {
                            enableButtons();
                        });
            }
        });

        btnModalConfirm.on("click", e => {
            axios
                .delete(`${deleteUrl}/${idInput.val()}`, { id: idInput.val() })
                .then(response => {
                    responseChecker(response);
                    clearFields();
                })
                .catch(response => {
                    responseChecker(response);
                })
                .finally(() => {
                    modal.modal("hide");
                    enableButtons();
                    scrollTop();
                });
        });


        table.on("load-success.bs.table", e => {
            j("[data-toggle='editar']").on("click", e => {
                load(j(e.currentTarget).data("value"))
            });
            j("[data-toggle='excluir']").on("click", e => { del(j(e.currentTarget).data("value")) });
        });
    }

    const load = (id) => {
        showLoading();
        axios
            .get(`${searchUrl}/${id}`)
            .then(response => {
                idInput.val(id);
                nomeInput.val(response.data.nome);
                cpfInput.val(response.data.cpf);
            });
    }

    const del = (id) => {
        idInput.val(id);
        modal.modal("show");
    }

    const clearFields = () => {
        idInput.val("");
        nomeInput.val("");
        cpfInput.val("");
        form[0].reset();
    }

    const blockButtons = () => {
        btnModalConfirm.prop("disabled", true);
        btnNew.prop("disabled", true);
        btnSubmit.prop("disabled", true);
    }

    const enableButtons = () => {
        btnModalConfirm.prop("disabled", false);
        btnNew.prop("disabled", false);
        btnSubmit.prop("disabled", false);
    }

    const responseChecker = (response) => {
        if (response.data.success === true) {
            messageTitle.html("Success");
            message.html(response.data.message)
            alert.removeClass("alert-danger").addClass("alert-success show");
            table.bootstrapTable("refresh");
        } else {
            let error = showErrors(response.data.message);
            messageTitle.html("Erro");
            message.html(error);
            alert.removeClass("alert-success").addClass("alert-danger show");
        }

        setTimeout(() => alert.removeClass("show"), 3000);
    }

    const showErrors = (modelState) => {
        let message = "";
        let propStrings = Object.keys(modelState);

        j.each(propStrings, function (i, propString) {
            let propErrors = modelState[propString].errors;
            j.each(propErrors, function (j, propError) {
                message += `<b>${propString}</b>: ${propError.errorMessage}<br/>`;
            });
            message += "\n";
        });

        return message;
    }

    const formatter = (value, row, index) => {
        return `
                <button class="btn btn-sm btn-warning" type="button" data-toggle="editar" data-value="${value}">Editar</button>
                <button class="btn btn-sm btn-danger" type="button" data-toggle="excluir" data-value="${value}">Excluir</button>`;
    }


    return { init, formatter }
})($)

window.app = App;
$(document).ready(() => App.init());