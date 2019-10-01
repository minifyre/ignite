//todo:abstract out boilerplate into spark (hourglass dependency tree instead of n^2 connections)
import truth from '../../truth/src/index.js'
import v,{forceEvtUpdate} from '../../v/src/index.js'
import spark,{curry,clone,getSetter} from '../../spark/index.js'

import kanji from './kanji.js'
import leitner from './leitner/index.js'

const
privateId=spark.id(),
firstPane=spark.id(),
firstFile=spark.id(),
firstView=spark.id(),
//todo:use
state=
{
	files:
	{
		//todo:mkList()
		[firstFile]:
		{
			data:Object.assign(
				{
					_:
					{
						id:'_',
						list:[0,1,2,3,4,5,6,7,8]
					},
					0:
					{
						id:0,
						list:Object.values(spark.map(kanji,({id})=>id)),
						text:'Unstudied'
					},
					1:{id:1,list:[],text:'Level 1'},
					2:{id:2,list:[],text:'Level 2'},
					3:{id:3,list:[],text:'Level 3'},
					4:{id:4,list:[],text:'Level 4'},
					5:{id:5,list:[],text:'Level 5'},
					6:{id:6,list:[],text:'Level 6'},
					7:{id:7,list:[],text:'Level 7'},
					8:{id:8,list:[],text:'Mastered'}
				},
				kanji
			),
			id:firstFile,
			meta:
			{
				name:'japanese',
				type:'json'
			},
			type:'list'
		}
	},
	views:
	{
		[privateId]:
		{
			id:privateId,
			panes:
			{
				//todo:mkPane()
				[firstPane]:
				{
					height:100,
					id:firstPane,
					width:100,
					view:firstView,
					x:0,
					y:0
				}
			},
			type:'ignite'
		},
		[firstView]:
		{
			file:firstFile,
			id:firstView,
			lastAnswered:0,
			paths:
			{
				list:[],
				opts:[]
			},
			pauseRender:false,
			quiz:[],
			type:'leitner memory box'
		}
	}
},
util={},
input={},
logic={},
output={app:{'leitner memory box':leitner}},
config={},
enums=
{
	unflipped:-2,
	unanswered:-1,
	incorrect:0,
	correct:1,
	graded:2
},
updateView=truth.compile(state=>v.render(document.body,output.panes,state))


input.download=(state,evt)=>
{
	evt.preventDefault()

	const
	{data,meta}=state.file,
	blob=new Blob([JSON.stringify(data)],{type:'text/plain'}),
	download=meta.name+ '.'+ meta.type,
	href=URL.createObjectURL(blob),
	link=Object.assign(document.createElement('a'),{download,href})

	document.body.appendChild(link)
	link.click()
	link.remove()
}
input.openFile=function(state,{target:{files}})
{
	if(!files.length) return
	// todo: open all files in tabs
	const
	[file]=files,
	blob=file.slice(0,file.size),
	handlers={onloadend:({target})=>
	{
		// todo: get meta data here
		if(target.readyState===FileReader.DONE) state.file.data=JSON.parse(target.result)
	}}

	Object.assign(new FileReader(),handlers).readAsText(blob)
}


//todo:spinoff into other files
output.btnFileOpen=state=>v(
	'label',
	{style:'-webkit-appearance:button;padding:0.1rem;'},
	'open',
	v.input({hidden:'hidden',on:{change:evt=>input.openFile(state,evt)},type:'file'})
)
output.btnFileSync=state=>v.button({on:{click:evt=>input.download(state,evt)}},'sync')

output.saveBtns=state=>
[
	v.button({disabled:'disabled'},'local'),//todo:make dropdown for local comp & google play
	output.btnFileOpen(state),
	output.btnFileSync(state)
]

output.panes=state=>
{
	return Object.values(state.views[privateId].panes).map(pane=>{
		const view=state.views[pane.view],
			file=state.files[view.file]

		return v.div(
			{id:pane.id,style:spark.box2style(pane)},
			// todo:tabs
			v.header({},...output.saveBtns({file,view})),
			// todo:add attrs
			v.div({},...output.app.stateViewer({file,view},output.app[view.type])) //todo:add otherViews as third arg
		)
	})
}

output.app.stateViewer=(state,app)=>
{
	return [
		...app(state),
		v.pre({},JSON.stringify(state.view, null, 4))
	]
}

//todo:use rpg state pattern here to enable chant & abstract it out
//init
truth(state,updateView)
