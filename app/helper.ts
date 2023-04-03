import Application from '@ioc:Adonis/Core/Application'
import Drive from '@ioc:Adonis/Core/Drive'
import moment from 'moment'
export async function UploadFile(file, namefile, pathtarget) {
    return await file.move(Application.tmpPath(pathtarget), {
        name: `${namefile}.${file.extname}`,
        overwrite: true,
    })
}
export async function UnlinkFile(namefile, pathtarget) {
    const filePath = Application.tmpPath(`${pathtarget}/${namefile}`)
    return await Drive.delete(filePath)
}
export function DateTimeFormated(format, date) {
    return moment(date).format(format)
}
export function uniqueString(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}
export function uniqueDatime(xDate) {
    return xDate.getFullYear().toString(10).substring(2)
        + (xDate.getMonth() + 1).toString(10).padStart(2, '0')
        + xDate.getDate().toString(10).padStart(2, '0')
        + xDate.getHours().toString(10).padStart(2, '0')
        + xDate.getMinutes().toString(10).padStart(2, '0')
        + xDate.getSeconds().toString(10).padStart(2, '0')
}
export function arrayUnique(array) {
    var a = array.concat();
    for (var i = 0; i < a.length; ++i) {
        for (var j = i + 1; j < a.length; ++j) {
            if (a[i] === a[j])
                a.splice(j--, 1);
        }
    }
    return a;
}