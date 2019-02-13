class Despesa {

    constructor(ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano;
        this.mes = mes;
        this.dia = dia;
        this.tipo = tipo;
        this.descricao = descricao;
        this.valor = valor;
    }

    validarDados() {
        for(let i in this) {
            if( this[i] == null || this[i] == undefined || this[i] == '')
                return false;
        }

        return true;
    }

}

class Bd {

    constructor() {
        let id = localStorage.getItem('id');

        if(id === null)
            localStorage.setItem('id', 0);
    }

    obterProximoId() {
        let proximoId = parseInt(localStorage.getItem('id')) + 1;
        return proximoId;
    }

    gravar(dadosDespesa) {
        let id = this.obterProximoId();

        localStorage.setItem(id, JSON.stringify(dadosDespesa));
        localStorage.setItem('id', id);
    }

    recuperarTodosRegistros() {
        let arrayListaDeDespesas = Array();
        let id = localStorage.getItem('id');

        for(let i = 1; i<= id; i++) {
            if(localStorage.getItem(i) != null) {
                let despesa = JSON.parse(localStorage.getItem(i));
                despesa.id = i;
                arrayListaDeDespesas.push(despesa); 
            }
        }

        return arrayListaDeDespesas;
    }

    pesquisar(despesa) {
        let despesasFiltradas = this.recuperarTodosRegistros();

        if(despesa.ano != '')
            despesasFiltradas = despesasFiltradas.filter(despesaFiltro => despesaFiltro.ano == despesa.ano);

        if(despesa.mes != '')
            despesasFiltradas = despesasFiltradas.filter(despesaFiltro => despesaFiltro.mes == despesa.mes);
    
        if(despesa.dia != '')
            despesasFiltradas = despesasFiltradas.filter(despesaFiltro => despesaFiltro.dia == despesa.dia);

        if(despesa.tipo != '')
            despesasFiltradas = despesasFiltradas.filter(despesaFiltro => despesaFiltro.tipo == despesa.tipo);

        if(despesa.descricao != '')
            despesasFiltradas = despesasFiltradas.filter(despesaFiltro => despesaFiltro.descricao == despesa.descricao);

        if(despesa.valor != '')
            despesasFiltradas = despesasFiltradas.filter(despesaFiltro => despesaFiltro.valor == despesa.valor);

        return despesasFiltradas;
    }

    remover(id) {
        localStorage.removeItem(id);
    }

} let bd = new Bd(); 

function cadastrarDespesa() {

    let ano = document.getElementById('ano'),
        mes = document.getElementById('mes'),
        dia = document.getElementById('dia'),
        tipo = document.getElementById('tipo'),
        descricao = document.getElementById('descricao'),
        valor = document.getElementById('valor');

    let despesa = new Despesa(
        ano.value,
        mes.value,
        dia.value,
        tipo.value,
        descricao.value,
        valor.value
    )
    
    if(despesa.validarDados() == true) {
        bd.gravar(despesa);
        $('#sucessoGravacao').modal('show');
        
        ano.value = '';
        mes.value = '';
        dia.value = '';
        tipo.value = '';
        descricao.value = '';
        valor.value = '';

    } else
        $('#erroGravacao').modal('show');

} 

function carregaListaDespesas(registrosDespesas = bd.recuperarTodosRegistros() ) {

    let despesas = registrosDespesas;

    let listaDespesas = document.getElementById('listaDespesas');
    listaDespesas.innerHTML = '';
    
    despesas.forEach(function(despesa) {
        let linha = listaDespesas.insertRow();
        linha.insertCell(0).innerHTML = `${despesa.dia}/${despesa.mes}/${despesa.ano}`;
        linha.insertCell(1).innerHTML = despesa.tipo;
        linha.insertCell(2).innerHTML = despesa.descricao;
        linha.insertCell(3).innerHTML = despesa.valor;
        
        let botaoExlusao = document.createElement('button');
        botaoExlusao.className = 'btn btn-danger btn-sm';
        botaoExlusao.innerHTML = '<i class="fas fa-times"></i>';
        botaoExlusao.id = `id_despesa_${despesa.id}`;

        botaoExlusao.onclick = function() {

            bd.remover(this.id.replace('id_despesa_', ''));
            window.location.reload();

        }

        linha.insertCell(4).append(botaoExlusao);
    });
    
}

function pesquisarDespesa() {

    let ano = document.getElementById('ano').value,
        mes = document.getElementById('mes').value,
        dia = document.getElementById('dia').value,
        tipo = document.getElementById('tipo').value,
        descricao = document.getElementById('descricao').value,
        valor= document.getElementById('valor').value;

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor);

    carregaListaDespesas(bd.pesquisar(despesa));

}