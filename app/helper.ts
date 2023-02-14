import Application from '@ioc:Adonis/Core/Application'
import Drive from '@ioc:Adonis/Core/Drive'
import moment from 'moment'
export async function UploadFile(file, namefile, pathtarget) {
    return await file.move(Application.tmpPath(pathtarget), {
        name: `${namefile}.jpg`,
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