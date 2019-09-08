//todo: abstract out boilerplate into environment (hourglass dependency tree instead of n^2)
import truth from '../../truth/src/index.js'
import v from '../../v/src/index.js'
import {curry,id} from '../../silo/index.js'

const
privateId=id(),
//todo: use 
state=
{
	files:{},
	views:
	{
		[privateId]:
		{
			id:privateId,
			type:'spark'
		}
	}
},
input={},
output=state=>[v.header({},
	output.btnFileOpen(state),
	output.btnFileSync(state)
)],
updateView=truth.compile(state=>v.render(document.body,output,state))

//todo: spinoff into other files
output.btnFileOpen=state=>v('label',{style:'-webkit-appearance:button;padding:0.1rem;'},'open',
	v.input({hidden:'hidden',on:{change:curry(input.openFile,state)},type:'file'})
)
output.btnFileSync=state=>v.button({on:{click:curry(input.download,state)}},'sync')

//todo: use rpg state pattern here to enable chant & abstract it out
//init
truth(state,updateView)

