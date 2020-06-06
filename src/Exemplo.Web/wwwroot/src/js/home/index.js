import "../../scss/home.scss";

import 'bootstrap-table/dist/bootstrap-table.js';
import 'bootstrap-table/dist/locale/bootstrap-table-pt-BR.js'

import axios from "axios";
import $ from "jquery";
import "bootstrap";
import "jquery-validation";
import "jquery-validation-unobtrusive";

const App = (() => {
    let searchUrl,
        createUrl,
        editUrl,
        deleteUrl,
        idInput,
        nomeInput,
        cpfInput,
        btnNew,
        btnSubmit,
        table,
        form,
        alert,
        messageType,
        message;

    const init = () => {
        searchUrl = $("#buscar-url").val();
        createUrl = $("#novo-url").val();
        editUrl = $("#editar-url").val();
        deleteUrl = $("#excluir-url").val();
        idInput = $("#Id");
        nomeInput = $("#Nome");
        cpfInput = $("#Cpf");
        btnSubmit = $("#btnSalvar");
        btnNew = $("#btnNovo");
        table = $("[data-toggle='table']");
        form = $("#form");
        alert = $("#alert");
        messageType = $("#messageType");
        message = $("#message");
        initEvents();
    };

    const initEvents = () => {
        btnNew.on("click", () => clearFields());

        btnSubmit.on("click", e => {
            form.validate();
            if (form.valid()) {
                const obj = { id: Number(idInput.val()), nome: nomeInput.val(), cpf: cpfInput.val() };
                if (!obj.id || obj.id === 0)
                    axios.post(createUrl, obj)
                        .then(response => { responseChecker(response); clearFields(); })
                        .catch(response => { console.log(response) });
                else
                    axios
                        .put(`${editUrl}/${obj.id}`, obj).then(response => { responseChecker(response); clearFields(); })
                        .catch(response => { console.log(response) });
            }
        });


        table.on("load-success.bs.table", e => {
            $("[data-toggle='editar']").on("click", e => {
                load($(e.currentTarget).data("value"))
            });
            $("[data-toggle='excluir']").on("click", e => { del($(this).data("value")) });
        });
    };

    const load = (id) => {
        axios
            .get(`${searchUrl}/${id}`)
            .then(response => {
                idInput.val(id);
                nomeInput.val(response.data.nome);
                cpfInput.val(response.data.cpf);
            });
    };

    const del = (id) => {
        console.log("Excluindo")
    };

    const clearFields = () => {
        idInput.val("");
        nomeInput.val("");
        cpfInput.val("");
        form.validate().resetForm();
    }

    const responseChecker = (response) => {
        if (response.data.success === true) {
            messageType.html("Success");
            message.html(response.data.message)
            alert.removeClass("alert-danger").addClass("alert-success show");
            table.bootstrapTable("refresh");
        } else {
            let error = showErrors(response.data.message);
            messageType.html("Erro");
            message.html(error);
            alert.removeClass("alert-success").addClass("alert-danger show");
        }

        setTimeout(() => alert.removeClass("show"), 3000);
    }

    const showErrors = (modelState) => {
        let message = "";
        let propStrings = Object.keys(modelState);

        $.each(propStrings, function (i, propString) {
            let propErrors = modelState[propString].errors;
            $.each(propErrors, function (j, propError) {
                message += `<b>${propString}</b>: ${propError.errorMessage}<br/>`;
            });
            message += "\n";
        });

        return message;
    };

    const formatter = (value, row, index) => {
        return `
                <button class="btn btn-sm btn-warning" type="button" data-toggle="editar" data-value="${value}">Editar</button>
                <button class="btn btn-sm btn-danger" type="button" data-toggle="excluir" data-value="${value}">Excluir</button>`;
    };

    return { init, formatter }
})();

window.app = App;
$(document).ready(() => App.init());
