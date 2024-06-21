/*botões*/
const btnAddTask = document.querySelector('#btn_add');
const btnSaveTask = document.querySelector('#btn_save');
const btnCancelTask = document.querySelector('#btn_cancel');
/*form*/
const formulario = document.querySelector('.app__form_add_tasks');
const div_formulario = document.querySelector('.app__form');
/*inputs da task*/
const name_task = document.querySelector('#name_task');
const task = document.querySelector('#task');
const class_task = document.querySelector('#class_task');
const date_task = document.querySelector('#date_task');
const status_task = document.querySelector('#status_task');
/*Painel Lista Tarefas*/
let tarefas_ls = JSON.parse(localStorage.getItem('tarefas')) || [];
const div_lista_tasks = document.querySelector('.app__list_tasks');
/*Pega valores dos select*/
const opcaoClassificacao = formulario.querySelector('#class_task');
const opcaoStatus = formulario.querySelector('#status_task');
/* div de confirmar a exclusão de tarefas*/
const formConfirmacao = document.querySelector('.app__form_confirma');
const btn_confirme = document.querySelector('#btn_confirme');
const btn_cancelar = document.querySelector('#btn_cancelar');
/*Variável que controla atualização*/
let novaTarefa = null;
/*Change color Task*/
const mudarCorDoCard = (regra, cor) => {
    const styleCores = document.createElement('style');
    document.head.appendChild(styleCores);
    styleCores.sheet.insertRule(`.${regra}{
             background: linear-gradient(to bottom, var(--cor-base) 10%, ${cor} 70%);
            }`, 0);
};
const color_task = formulario.querySelector('#task_color');
let cor_escolhida = ""
color_task.addEventListener('change', (e) => {
    cor_escolhida = e.target.value;
})
/*Create Task*/
const atualizarDados = (tarefa) => {
    localStorage.setItem('tarefas', JSON.stringify(tarefa));
};
/*Inseri dados na lista da página*/
const apagarTarefa = (padrao) => {
    tarefas_ls  = tarefas_ls.filter(task => task.nome !== padrao);
    atualizarDados(tarefas_ls);
    location.reload();
};

const finalizarTarefa = (index) => {
    tarefas_ls[index].detalhes.status = 'F';
    atualizarDados(tarefas_ls);
}
const editarTarefa = (index) => {
    btnToggle();
    novaTarefa = index;
    formulario.querySelector('#name_task').value = tarefas_ls[index].nome;
    formulario.querySelector('#task').value = tarefas_ls[index].detalhes.descricao;
    formulario.querySelector('#class_task').value = tarefas_ls[index].detalhes.class;
    for(let i = 0; i < opcaoClassificacao.length; i++) {
        if(opcaoClassificacao.options[i].value === tarefas_ls[index].detalhes.classificacao){
            opcaoClassificacao.selectedIndex = i;
            break;
        }
    }
    formulario.querySelector('#date_task').value = tarefas_ls[index].detalhes.prazo;
    for(let i = 0; i <opcaoStatus.length; i++ ){
        if(opcaoStatus.options[i].value === tarefas_ls[index].detalhes.status){
            opcaoStatus.selectedIndex = i;
            break;
        }
    }
    formulario.querySelector('#task_color').value = tarefas_ls[index].detalhes.cor;
}
const criaElemento = (tarefa, index) => {
    let elementoI
    switch(tarefa.detalhes.classificacao.toLowerCase()) {
        case 'profissional' :   elementoI = 'bi-person-badge';
                                break;
        case 'familiar'     :   elementoI = 'bi-house-heart-fill';
                                break;
        case 'lazer'        :   elementoI = 'bi-bicycle';
                                break;
    }
    /*Cria a div da tarefa*/
    let itemTarefa = document.createElement('div');
    itemTarefa.classList.add("app__list_tasks_task", `${tarefa.detalhes.classificacao.toLowerCase()}`);
    if(tarefa.detalhes.cor !== "") {
        itemTarefa.classList.add("app__list_tasks_task", `${tarefa.detalhes.classificacao.toLowerCase()}_${index}`);
        mudarCorDoCard(`${tarefa.detalhes.classificacao.toLowerCase()}_${index}`,tarefa.detalhes.cor)
    }
    /*Cria a dive de nome da tarefa e adiciona os elementos*/
        let taskName = document.createElement('div');
            taskName.classList.add('task_name');
            let icon = document.createElement('i')
            icon.classList.add('bi',elementoI);
            taskName.appendChild(icon);
            let spanName = document.createElement('span');
            spanName.classList.add('name');
            spanName.innerHTML = tarefa.nome;
            taskName.appendChild(spanName);
            let TaskActions = document.createElement('div');
            TaskActions.classList.add('task_actions');
                let spanBtnSucess = document.createElement('span');
                spanBtnSucess.classList.add('btn', 'btn-success' ,'btn-sm');
                if(tarefa.detalhes.status !== 'F'){
                    spanBtnSucess.innerHTML = "<i class='fa fa-edit'></i>";
                    spanBtnSucess.onclick = () => {
                        editarTarefa(index);
                    };
                } else {
                    spanBtnSucess.innerHTML = "<i class='fa fa-lock'></i>";
                }
                TaskActions.appendChild(spanBtnSucess);
                let spanBtnDanger = document.createElement('span');
                spanBtnDanger.classList.add('btn', 'btn-danger','btn-sm');
                spanBtnDanger.innerHTML = "<i class='fa fa-eraser'></i>";
                spanBtnDanger.onclick = () => {
                    formConfirmacao.classList.remove('hidden');
                    formConfirmacao.querySelector('#mensagem_tarefa').innerHTML = tarefa.nome;
                    btn_confirme.onclick = () => {
                        apagarTarefa(tarefa.nome);
                    };
                    btn_cancelar.onclick = () => {
                        formConfirmacao.classList.add('hidden');
                    };
                };
                TaskActions.appendChild(spanBtnDanger);
                let spanBtnWarning = document.createElement('span');
                spanBtnWarning.classList.add('btn', 'btn-warning','btn-sm');
                if(tarefa.detalhes.status !== 'F'){
                    spanBtnWarning.innerHTML = "<i class='fa fa-check'></i>";
                    spanBtnWarning.onclick = () => {
                        finalizarTarefa(index);
                        location.reload();
                    }
                }else{
                    spanBtnWarning.innerHTML = "<i class='fa fa-lock'></i>";
                }
            TaskActions.appendChild(spanBtnWarning);
            taskName.appendChild(TaskActions);
        let taskDetails = document.createElement('div');
        taskDetails.classList.add("task_details");
            let spanDesc = document.createElement('span');
            spanDesc.classList.add('details');
            spanDesc.innerHTML = tarefa.detalhes.descricao;
            taskDetails.appendChild(spanDesc);
            let spanPrazo = document.createElement('span');
            spanPrazo.classList.add('date');
            let prazoData = new Date(tarefa.detalhes.prazo)
            spanPrazo.innerHTML = `<strong>Prazo: ${prazoData.toLocaleTimeString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: "numeric" ,
                hour: '2-digit',
                minute: '2-digit',
            })} </strong>`;
            taskDetails.appendChild(spanPrazo);
            let spanStatus = document.createElement('span');
            spanStatus.classList.add('status');
            for(let i = 0; i < opcaoStatus.length; i++ ){
                if(opcaoStatus.options[i].value === tarefa.detalhes.status)
                    spanStatus.innerHTML = `Status: ${opcaoStatus.options[i].innerHTML}`;
            }
            taskDetails.appendChild(spanStatus);
    itemTarefa.appendChild(taskName);
    itemTarefa.appendChild(taskDetails);
    return itemTarefa;
}
/*Carrega as tarefas na página*/
tarefas_ls.forEach((tarefa, index) => {
    const divElemento = criaElemento(tarefa, index);
    div_lista_tasks.prepend(divElemento);
});
/*exibir formulário*/
const btnToggle = () => {
    formulario.classList.toggle('hidden');
    div_formulario.classList.toggle('app__form_grid');
    btnAddTask.classList.toggle("hidden");
};
btnAddTask.addEventListener('click', () => {
    btnToggle();
});
btnCancelTask.addEventListener('click', () => {
    novaTarefa = null;
    btnToggle();
});
btnSaveTask.addEventListener('click', () => {
    // btnToggle();
});
formulario.addEventListener('submit', (e) => {
    e.preventDefault();
    let tarefa = {
        'nome': name_task.value,
        'detalhes': {
            'descricao': task.value,
            'classificacao': class_task.value,
            'prazo': date_task.value,
            'status': status_task.value,
            'cor' : novaTarefa === null ? cor_escolhida : color_task.value,
        }
    }
    if(novaTarefa === null) {
        tarefas_ls.push(tarefa);
    }else{
        tarefas_ls[novaTarefa].nome = tarefa.nome;
        tarefas_ls[novaTarefa].detalhes.descricao = tarefa.detalhes.descricao;
        tarefas_ls[novaTarefa].detalhes.classificacao = tarefa.detalhes.classificacao;
        tarefas_ls[novaTarefa].detalhes.prazo = tarefa.detalhes.prazo;
        tarefas_ls[novaTarefa].detalhes.status = tarefa.detalhes.status;
        tarefas_ls[novaTarefa].detalhes.cor = tarefa.detalhes.cor;
    }
    atualizarDados(tarefas_ls);
    e.target.reset();
    location.reload();
});
