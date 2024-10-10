const {Ollama} = require('ollama');
const ollama = new Ollama();
global.XMLHttpRequest = require('xhr2')
var xhr = new XMLHttpRequest();

const t = async () => {
        const resp = await ollama.chat({
                model : "gemma2:latest",
                messages: [{
                        role : 'user', 
                        content : '안녕',
                }]
        });
       console.log(resp)
       console.log(decodeURIComponent(escape(resp.message.content)))
}

t();