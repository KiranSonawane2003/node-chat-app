[{
    id:'/^kdhfk45df',
    name: "Suraj",
    room: "The Office Fans"
}]

    //addUsers(id, name, room)
    //removeUser(id)
    //getUser(id)
    //getUserList(room)

    class Users {
        constructor() {
            this.users = [];
        }
        addUser (id, name, room) {
            var user = {id, name, room}
            this.users.push(user);

            return user;
        }
        removeUser (id)  {
             var user = this.getUser(id);

            if(user) {
                this.users = this.users.filter((user) => user.id !== id );
            }
            return user;           
        }
        getUser (id) {
            return this.users.filter((user) => user.id === id )[0]

        }
        getUserList (room) {
            var users = this.users.filter((user) => user.room === room );
            var namesArray = users.map((user) => user.name);
            return namesArray
        }

    }

module.exports = {Users};
//     class Person {
//         constructor(name, age) {
//             this.name = 'Else';
//             this.age = 23
//         // console.log(name, age);
            
//         }
//     }

//     var me = new Person('Suraj', 23);
// console.log(me.name, me.age);