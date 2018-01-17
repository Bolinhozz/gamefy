Template.NewTask.onRendered(function () {

    //cria e configura o datepicker para selecionar o prazo
    $('.datepicker').pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 15, // Creates a dropdown of 15 years to control year,
        today: 'Today',
        clear: 'Clear',
        close: 'Ok',
        min: new Date(),
        closeOnSelect: false, // Close upon selecting a date,
        onStart: function() {
              var date = new Date()
              this.set('select', [date.getFullYear(), date.getMonth(), date.getDate()]);
        }
    });
});


Template.NewTask.events({

'submit .new-task-form': function(event, template) {
    
    event.preventDefault();
 
    const target = event.target;
    const id = FlowRouter.getParam('id');
    const current_class = Classes.findOne({_id: id});

    //crio o objeto tarefa para enviar para o servidor
    const new_task = {
        name: target.name.value, 
        description: target.description.value, 
        points: target.points.value, 
        grade: target.grade.checked, 
        class_id: current_class._id, 
        due: target.due.value,
        /*o array vazio é utilizado para adicionar os estudantes 
        que realizaram as tarefas, permitindo uma contagem rapida
        sem ter que usar o subarray dos enrollments 
        */
        students: []
    };

    Meteor.call('tasks.insert', new_task, (error, result) => {
            if(!error){
                $('#new-task').modal('close');
                template.find(".new-task-form").reset();
            }
        });
         
    }
}); 