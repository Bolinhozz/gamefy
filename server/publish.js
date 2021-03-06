Meteor.publish('classes', function() {

    if (Roles.userIsInRole(this.userId, ['teacher'])) {
        return Classes.find({
            owner: this.userId
        });
    }
    else{
        let classes_id = Enrollments.find({
                student_id: this.userId}, {fields: {'class_id':1}
            }).map(function (enrollment) { 
                return enrollment.class_id; 
            });
        return Classes.find({
            _id: {$in: classes_id}
        });
    }

});

Meteor.publish('students', function(class_id) {
    return [Enrollments.find({
        class_id: class_id
    }), Meteor.users.find({}, {fields: {'profile.avatar': 1}})];
});

Meteor.publish('tasks', function(class_id) {
    if (Roles.userIsInRole(this.userId, ['teacher'])){
        return Tasks.find({
            class_id: class_id
        });    
    }
    else{
        return [Enrollments.find({
            student_id: Meteor.userId(), class_id: class_id}, {fields: {student_name: 1, tasks: 1}
        }),
        Tasks.find({
            class_id: class_id}, {fields:{name: 1, due: 1}
        })];  
    }
});

Meteor.publish('tests', function(class_id) {
    if (Roles.userIsInRole(this.userId, ['teacher'])){
        return Tests.find({
            class_id: class_id
        });    
    }
    else{
        return [Enrollments.find({
            student_id: Meteor.userId(), class_id: class_id}, {fields: {student_name: 1, student_id: 1, tests: 1, class_id: 1}
        }),
        Tests.find({
            class_id: class_id}, {fields:{name: 1, class_id: 1, status: 1}
        })];  
    }
});

Meteor.publish('test-single', function(test_id) {
    const class_id = Tests.findOne(test_id).class_id;
    if (Roles.userIsInRole(this.userId, ['teacher'])){
        return Tests.find({
            _id: test_id
        }, {fields: {name: 1, status: 1, description: 1, questions: 1, class_id: 1, start_time: 1, end_time: 1}});    
    }
    else{
        return [Tests.find({
            _id: test_id
        }, {fields: {start_time: 0, students_done: 0, end_time: 0, 'questions.correct_answer': 0}}),
        Enrollments.find(
            {student_id: Meteor.userId(), class_id: class_id, 'tests.test_id': test_id}, 
        {fields: {'tests.$': 1}})];  
    }
});

Meteor.publish('broochs', function(class_id) {
    if (Roles.userIsInRole(this.userId, ['teacher'])){
        return Broochs.find({
            owner: this.userId,
            class_id: class_id
        }); 
    } 
    else{
         let badges = Enrollments.findOne({student_id: Meteor.userId(), class_id: class_id}).badges;
         return Broochs.find({_id: {$in: badges}});
    }  
});


Meteor.publish('enrollment-task', function(task_id){
    return [Enrollments.find({
        "tasks.task_id": task_id}, {fields: {student_name: 1, 'tasks.$': 1}
        }), 
        Tasks.find({
            _id: task_id}, {fields:{name: 1, description: 1, grade: 1, due: 1, class_id: 1}
        })];
})  

Meteor.publish('class-image', function(class_id){
    const current_class = Classes.findOne({_id: class_id}, {fields:{imageName: 1}});
    return Images.find({name: current_class.imageName}).cursor;
});