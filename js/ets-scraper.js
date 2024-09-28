const retrieveShifts = document.getElementById("retrieveShifts") 

retrieveShifts.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({
        active: true, currentWindow: true
    })

    if(!(tab.url?.startsWith("https://etimesheets"))) {
        window.open(chrome.runtime.getURL('html/results.html'))
        return
    }
    chrome.scripting.executeScript({
        target: {tabId: tab.id},
        func: scrapeShifts,
    })
    window.open(chrome.runtime.getURL('html/results.html'))
})

function scrapeShifts() {
    let duration = []
    let sDates = []
    let eDates = []

    const shiftElements = document.getElementsByClassName("card-section shift-holder")
    for(let i = 0; i < shiftElements.length; i++) {
        for(let j = 0; j < 9; j++) {
            if(shiftElements[i].getElementsByTagName("p")[j].textContent
            .match(/(Shift Duration: (((\d{2}|\d{1}) (hours|hour), (\d{2}|\d{1}) (minutes|minute))))/gim)) {
                duration[i] = shiftElements[i].getElementsByTagName("p")[j].textContent
            }
            if(shiftElements[i].getElementsByTagName("p")[j].textContent
            .match(/(Start: ([A-z]{3} \d{2}\/\d{2}\/\d{2}, ((\d{2}|\d{1}):(\d{2}(am|pm)))))/gim)) {
                sDates[i] = shiftElements[i].getElementsByTagName("p")[j].textContent
            }
            if(shiftElements[i].getElementsByTagName("p")[j].textContent
            .match(/(End: ([A-z]{3} \d{2}\/\d{2}\/\d{2}, ((\d{2}|\d{1}):(\d{2}(am|pm)))))/gim)) {
                eDates[i] = shiftElements[i].getElementsByTagName("p")[j].textContent
            }
        }
    }
    chrome.storage.local.set({shiftDuration: duration}, function() {})
    chrome.storage.local.set({startDates: sDates}, function() {})
    chrome.storage.local.set({endDates: eDates}, function() {})
}