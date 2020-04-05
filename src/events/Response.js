import Room from '../models/Room.js'

export default (data) => {
    
    if (data instanceof Error) {
        return {
            'success': false,
            'message': data.message
        };
    } else if (data instanceof Room) {
        return {
            'success': true,
            'room': data.toJSON()
        }
    } else {
        return {
            'success': true,
            'data': data
        }
    }
}