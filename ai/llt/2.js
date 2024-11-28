// function generateRandonGender(){
//     let random = Math.random();
//     if (random < 0.5) {
//         return "男";
//     } else {
//         return "女";
//     }
// }
// function randomGender() {
//     return Math.random() < 0.5? "boy" : "girl";
// }
// console.log(randomGender());

function generateRandonGender(){
    const genders = ["man", "female"];
    return genders[Math.floor(Math.random() * genders.length)];
}