var tbodyEl = document.querySelector('#shiftTable tbody')

window.addEventListener('DOMContentLoaded', function() {
    let monthForm = document.querySelector("#monthForm")
    
    chrome.storage.local.get(['shiftDuration'], (result1) => {
        chrome.storage.local.get(['startDates'], (result2) => {
            chrome.storage.local.get(['endDates'], (result3) => {
                let duration = result1.shiftDuration

                if(duration == undefined)
                    return

                let sDates = result2.startDates
                let eDates = result3.endDates
                let startTime
                let endTime

                for(let i = 0; i < duration.length; i++) {
                    duration[i] = duration[i].replace("Shift Duration: ", "")
                    sDates[i] = sDates[i].replace("Start: ", "")
                    eDates[i] = eDates[i].replace("End: ", "")

                    startTime = sDates[i].match(/((\d{2}|\d{1}):(\d{2}|\d{1})(am|pm))/gim)
                    sDates[i] = sDates[i].replace(/(,\s(\d{2}|\d{1}):(\d{2}|\d{1})(am|pm))/gim, "")
                    
                    endTime = eDates[i].match(/((\d{2}|\d{1}):(\d{2}|\d{1})(am|pm))/gim)
                    eDates[i] = eDates[i].replace(/(,\s(\d{2}|\d{1}):(\d{2}|\d{1})(am|pm))/gim, "")
                    
                    tbodyEl.innerHTML += `
                        <tr>
                            <td class="monthSelection">${sDates[i]}-${eDates[i]}</td>
                            <td>${duration[i]}</td>
                            <td>${startTime}-${endTime}</td>
                        </tr>
                    `;
                }
                monthForm.addEventListener("submit", function (e) {
                    e.preventDefault()
                    let tHours = 0
                    let tMinutes = 0
                    let separateMinute = 0
                    
                    let monthInput = document.getElementById("month").value
                    let monthTotalDurationLabel = document.getElementById("monthTotalDuration")
                    let monthSelection = document.getElementsByClassName("monthSelection")

                    if(monthInput != null) {
                        for(let i = 0; i < sDates.length; i++) {
                            if(monthInput.toString() == sDates[i].substring(4, 6)) {
                                monthSelection[i].style.backgroundColor = "chartreuse"
                                separateMinute = duration[i].replace(/((\d{2}|\d{1}) ((hours|hour),\s))/gim, "")
                                separateMinute = separateMinute.replace(/(\s(minutes|minute))/gim, "")
                                tMinutes += +separateMinute
                                tHours += +(duration[i].substring(0, 1).trim())
                                if(tMinutes >= 60) {
                                    tHours += Math.floor(tMinutes/60)
                                    tMinutes = tMinutes % 60
                                }
                            } else {
                                monthSelection[i].style.backgroundColor = "white"
                            }
                        }
                        const fHours = tHours.toString().padStart(2, '0')
                        const fMinutes = tMinutes.toString().padStart(2, '0')
                        const res = `${fHours}:${fMinutes}`
                        
                        monthTotalDurationLabel.style.display = "inline"
                        
                        let monthDate = new Date()
                        monthDate.setMonth(monthInput - 1)
                        monthTotalDurationLabel.textContent = `Month of ${monthDate.toLocaleString('default', {month: 'long'})}: ${res} hour(s)`
                    }
                })
            })
        })
    })
}, false);