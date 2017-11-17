import xhr from './xhr/'

class MsgService {
   /**
   * 新增 msg
   * @param  {Object} msgBody { title:{String}, content:{String} }
   * @return {Promise}
   */
    add(msgBody) {
        return xhr({
            method: 'post',
            url: '/msg',
            body: msgBody
        })
    }
}
