let task=[]
const time=document.getElementById("time")
function updateTime(){
    chrome.storage.local.get(["timer","timeOption"],(res)=>{
        const time=document.getElementById("time")
        const minutes=`${res.timeOption-Math.ceil(res.timer/60)}`.padStart(2,"0")
        let seconds="00"
        if(res.timer%60!=0)
        {
       seconds=`${60-res.timer%60}`.padStart(2,"0")
        }
       
        time.textContent=`${minutes}:${seconds}`
    })
    
}
updateTime()
setInterval(updateTime,1000)
const startTImerBtn=document.getElementById("start-timer-btn")
startTImerBtn.addEventListener("click",()=>{
    chrome.storage.local.get(["isRunning"],(res)=>{
        chrome.storage.local.set({
            isRunning:!res.isRunning,
        },()=>{
            startTImerBtn.textContent=!res.isRunning?"Pause Timer":"Start Timer"
        })
    })
    
})

const resetTimerBtn=document.getElementById("reset-timer-btn")
resetTimerBtn.addEventListener("click",()=>{
    chrome.storage.local.set({
        timer:0,
        isRunning:false,
    },()=>{
        startTImerBtn.textContent="Start Timer"
    })
})

const addTaskBtn = document.getElementById("add-task-btn")

addTaskBtn.addEventListener("click", () => addTask())
chrome.storage.sync.get(["task"],(res)=>{task=res.task?res.task:[] 
    renderTasks()})
function saveTasks()
{
    chrome.storage.sync.set({task,})
}
function renderTask(tasklength){
    const taskRow = document.createElement("div")
    const text = document.createElement("input")
    text.type="text"
    text.placeholder="Enter a task . . ."
    text.className="task-input"
    text.value=task[tasklength]
    text.addEventListener("change",()=>{
        task[tasklength]=text.value
       saveTasks()
    })
    const deleteBtn=document.createElement("input")
    deleteBtn.type="button"
    deleteBtn.value="X"
    deleteBtn.className="task-delete"
    deleteBtn.addEventListener("click",()=>{
        deleteTask(tasklength)
    })
    taskRow.appendChild(text)
    taskRow.appendChild(deleteBtn)
    const taskcontainer=document.getElementById("task-container")
    taskcontainer.appendChild(taskRow)
}
function addTask() {
    const tasklength=task.length
    task.push("")
    renderTask(tasklength)
    saveTasks()
   
   
}

function deleteTask(tasklength)
{
    task.splice(tasklength,1)
    renderTasks()
    saveTasks()
}
function renderTasks(){
    const taskContainer=document.getElementById("task-container")
    taskContainer.textContent=""
     task.forEach((taskText,tasklength)=>{
         renderTask(tasklength)
     })

}