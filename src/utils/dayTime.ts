export function dayTime(arg = "0") {
    
    const someMonths = parseFloat(arg)
    const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]
    let month = 0
    let yearSome = 0
    
    month = new Date().getMonth()
    
    month += someMonths
    
    if(month>11){
        while (month > 11) {
            yearSome = Math.floor(month / 12)
            month = month % 12
        }
        
        month = 0 + month
    }
    const year = new Date().getFullYear() + yearSome

    return `${months[month]} ${year}`
}
export function returnMonthYear(monthYear: string){
    const string = monthYear.split(" ")
    const [month, year] = [string[0], string[1]]
    return [month, year]
}
export function findMonth(month: string){
    const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]
    let monthNumber = 0
    months.forEach((monthCurrent, index)=>monthCurrent === month? monthNumber = index: "")
    return monthNumber
}
export function daysOnMonth(month: string, year: string) {
    const monthNumber = findMonth(month)
    var data = new Date(parseFloat(year), monthNumber + 1, 0);
    return data.getDate();
}


