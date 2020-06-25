import "../../scss/home2.scss";

import axios from "axios";
import Vue from "vue";
import { scrollTop } from "../util";

new Vue({
    el: "#app",
    data() {
        return {
            searchUrl: "",
            postUrl: "",
            putUrl: "",
            deleteUrl: "",

            id: 0,
            nome: "",
            cpf: "",

            rows: [],
            total: 0,
            page: 1,
            pageSize: 10,
            openModal: false,

            showMessage: false,
            success: false,
            messageTitle: "",
            message: "",
        }
    },
    methods: {
        getData(page, pageSize) {
            axios
                .get(`${this.searchUrl}/?pageNumber=${page}&pageSize=${pageSize}`)
                .then(response => {
                    this.rows = response.data.rows;
                    this.total = response.data.total;
                })
                .catch(response => {
                    console.log(response);
                });
        },
        nextPage() {
            if (this.page < this.total / this.pageSize)
                this.page++;
        },
        previousPage() {
            if (this.page > 1)
                this.page--;
        },
        load(id) {
            this.id = id;
            axios
                .get(`${this.searchUrl}/?id=${id}`)
                .then(response => {
                    this.nome = response.data.nome;
                    this.cpf = response.data.cpf;
                });
        },
        del(id) {
            this.id = id;
            this.openModal = !this.openModal;
        },
        save() {
            const obj = { id: Number(this.id), nome: this.nome, cpf: this.cpf };
            axios({
                method: obj.id === 0 ? "POST" : "PUT",
                url: obj.id === 0 ? this.postUrl : this.putUrl,
                data: obj
            })
                .then(response => {
                    this.responseChecker(response);
                    this.clearFields();
                })
                .catch(response => {
                    this.responseChecker(response);
                })
                .finally(() => {
                    this.clearFields();
                });
        },
        clearFields() {
            this.id = 0;
            this.nome = "";
            this.cpf = "";
        },
        confirmDelete() {
            axios
                .delete(`${this.deleteUrl}/${this.id}`)
                .then(response => {
                    this.responseChecker(response);
                })
                .catch(response => {
                    this.responseChecker(response);
                })
                .finally(() => {
                    this.openModal = false;
                    this.id = 0;
                });
        },
        cancelDelete() {
            this.id = 0;
            this.openModal = !this.openModal;
        },
        closeNotification() {
            this.showMessage = false;
        },
        responseChecker(response) {
            this.messageTitle = response.data.success === true ? "Success" : "Error";
            this.message = response.data.success === true ? response.data.message : this.showErrors(response.data.message);
            this.success = response.data.success;
            this.showMessage = true;
            setTimeout(() => {
                this.showMessage = false;
                this.success = false;
            }, 3000);
            this.page = 1;
            this.getData(this.page, this.pageSize);
        },

        showErrors(modelState) {
            let message = "";
            let propStrings = Object.keys(modelState);
            for (let ps of propStrings) {
                let propErrors = modelState[propString].errors;
                for (let pe of propErrors)
                    message += `<b>${ps}</b>: ${pe.errorMessage}<br/>`;
                message += "\n";
            }
            return message;
        }
    },
    watch: {
        page() {
            this.getData(this.page, this.pageSize);
        }
    },
    mounted() {
        const searchUrlDom = document.getElementById("search-url");
        const postUrlDom = document.getElementById("post-url");
        const putUrlDom = document.getElementById("put-url");
        const deleteUrlDom = document.getElementById("delete-url");

        this.searchUrl = searchUrlDom.value;
        this.postUrl = postUrlDom.value;
        this.putUrl = putUrlDom.value;
        this.deleteUrl = deleteUrlDom.value;

        searchUrlDom.parentNode.removeChild(searchUrlDom);
        postUrlDom.parentNode.removeChild(postUrlDom);
        putUrlDom.parentNode.removeChild(putUrlDom);
        deleteUrlDom.parentNode.removeChild(deleteUrlDom);

        this.getData(this.page, this.pageSize);
    }
});
