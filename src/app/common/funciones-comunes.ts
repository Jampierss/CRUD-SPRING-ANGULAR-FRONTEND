export class FuncionesComunes {
    public static validateEmail(email):boolean {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    public static getFechaFormateada(date:Date):string {
        let year:string = date.getFullYear().toString();
        let month:string = (1 + date.getMonth()).toString();
        month = month.length > 1 ? month : '0' + month;

        let day:string = date.getDate().toString();
        day = day.length > 1 ? day : '0' + day;

        return `${year}/${month}/${day}`;
    }

    public static getHoraFormateada(date:Date): string {
        let hour: string = date.getHours().toString();
        hour = hour.length > 1 ? hour : '0' + hour;

        let minute: string = date.getMinutes().toString();
        minute = minute.length > 1 ? minute : '0' + minute;

        return `${hour}:${minute}`;
    }
}