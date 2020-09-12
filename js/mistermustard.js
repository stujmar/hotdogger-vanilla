let mustardButtons = [
{   id: "1",
    color: "red" },
{   id: "2",
    color: "rgb(249,231,33)"},
{   id: "3",
    color: "lime" },
{   id: "4",
    color: "rgb(180,45,0)"},
{   id: "5",
    color: "rgb(255,187,0)" },
{   id: "6",
    color: "turquoise"},
{   id: "7",
    color: "rgb(255, 255, 255)"}
];

for (let i = 0; i<7; i++) {  
    document.getElementById(`color-${mustardButtons[i].id}`).addEventListener('click',(e) => {
    e.preventDefault();
    console.log(fillColors[i]);
    document.getElementById("color-me").style.fill = mustardButtons[i].color;  
    });
}

