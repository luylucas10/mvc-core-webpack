import "../../scss/home.scss";

import 'bootstrap-table/dist/bootstrap-table.js';
import 'bootstrap-table/dist/locale/bootstrap-table-pt-BR.js'

import $ from "jquery";
import axios from "axios";

const App = (() => {
    var buscarUrl,
        novoUrl,
        editarUrl,
        excluirUrl,
        idInput,
        nomeInput,
        cpfInput,
        btnNovo,
        btnSalvar,
        table,
        alert,
        messageType,
        message;

    const init = () => {
        buscarUrl = $("#buscar-url").val();
        novoUrl = $("#novo-url").val();
        editarUrl = $("#editar-url").val();
        excluirUrl = $("#excluir-url").val();
        idInput = $("#id");
        nomeInput = $("#nome");
        cpfInput = $("#cpf");
        btnSalvar = $("#btnSalvar");
        btnNovo = $("#btnNovo");
        table = $("[data-toggle='table']");
        alert = $("#alert");
        messageType = $("#messageType");
        message = $("#message");
        registrarEventos();
    };

    const registrarEventos = () => {
        btnNovo.on("click", () => {
            idInput.val("");
            nomeInput.val("");
            cpfInput.val("");
        });

        btnSalvar.on("click", e => {
            const obj = { id: Number(idInput.val()), nome: nomeInput.val(), cpf: cpfInput.val() };
            if (!obj.id)
                axios.post(novoUrl, obj).then(response => responseChecker(response));
            else
                axios.put(`${editarUrl}/${obj.id}`, obj).then(response => responseChecker(response));
        });


        table.on("load-success.bs.table", e => {
            $("[data-toggle='editar']").on("click", e => {
                carregarEditar($(e.currentTarget).data("value"))
            });
            $("[data-toggle='excluir']").on("click", e => { carregaExcluir($(this).data("value")) });
        });
    };
    const carregarEditar = (id) => {
        axios
            .get(`${buscarUrl}/${id}`)
            .then(response => {
                idInput.val(id);
                nomeInput.val(response.data.nome);
                cpfInput.val(response.data.cpf);
            });
    };

    const carregarExcluir = (id) => {
        console.log("Excluindo")
    };

    const formatter = (value, row, index) => {
        return `
                <button class="btn btn-sm btn-warning" type="button" data-toggle="editar" data-value="${value}">Editar</button>
                <button class="btn btn-sm btn-danger" type="button" data-toggle="excluir" data-value="${value}">Excluir</button>`;
    };

    const responseChecker = (response) => {
        if (response.data.success === true) {
            messageType.html("Success");
            message.html(response.data.message)
            $("#alert").removeClass("alert-danger").addClass("alert-success show");
            table.bootstrapTable("refresh");
        } else {
            var error = showErrors(response.data.message);
            messageType.html("Erro");
            message.html(error);
            $("#alert").removeClass("alert-success").addClass("alert-danger show");
        }
    }
    const showErrors = (modelState) => {
        var message = "";
        var propStrings = Object.keys(modelState);

        $.each(propStrings, function (i, propString) {
            var propErrors = modelState[propString].errors;
            $.each(propErrors, function (j, propError) {
                message += `<b>${propString}</b>: ${propError.errorMessage}<br/>`;
            });
            message += "\n";
        });

        return message;
    };

    return { init, formatter }
})();

window.app = App;
$(document).ready(() => App.init());
