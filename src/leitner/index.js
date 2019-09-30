import v,{forceEvtUpdate} from '../../../v/src/index.js'
import spark,{curry,clone,getSetter} from '../../../spark/index.js'
import css from './index.css.js'

const
util={},
input={},
logic={},
output={},
config={},
enums=
{
	unflipped:-2,
	unanswered:-1,
	incorrect:0,
	correct:1,
	graded:2
}

//todo spinoff & let prop handle sub.props (via dot separators)
util.sortByProp=(prop,a,b)=>(a[prop]>b[prop]?1:-1)

logic.getEntry=(file,id)=>file.data[id]

logic.levelUpCards=(file,cards)=>
{
	const
	getEntry=curry(logic.getEntry,file),
	levels=getEntry('_').list.map(getEntry)

	cards.forEach(item=>
	{
		const parent=levels.find(level=>level.list.includes(item.id))
		parent.list.splice(parent.list.indexOf(item.id),1)//remove from old parent

		file.data[parent.id+1].list.push(item.id)//add to new parent
		//todo: when incremental ids are changed, this will break
		file.data[item.id].answered=item.answered//add time to card for future scheduling
	})
}

input.answer=({file,view},i,isCorrect)=>
{
	const {quiz}=view
	//todo move this directly into logic
	view.pauseRender=true
	quiz[i].correct=isCorrect
	let currentQuestion=view.quiz.findIndex(({correct})=>[enums.unflipped,enums.unanswered].includes(correct))
	//done with quiz
	if(
		currentQuestion===-1 &&
		view.quiz.filter(({correct})=>[enums.correct,enums.graded].includes(correct)).length===
			view.quiz.length
	)
	{
		const
		answered=Date.now(),//todo: this needs to be passed in to make this function pure
		cards=view.quiz
			.map(item=>spark.omit(['correct','level'],item))
			.map(item=>Object.assign(item,{answered}))

		logic.levelUpCards(file,cards)
		view.quiz=[]
	}
	//retry incorrect answers
	else if(currentQuestion===-1)
	{
		//reset correct & incorrect questions
		const resetQuiz=spark.shuffle(clone(view.quiz)).map((question)=>
		{
			if(question.correct===enums.incorrect)
			{
				question.level=1
				question.correct=enums.unflipped
			}
			else if(question.correct===enums.correct)
			{
				question.level+=1
				question.correct=enums.graded
			}

			return question
		})

		view.quiz=resetQuiz
		currentQuestion=view.quiz.findIndex(({correct})=>[enums.unflipped,enums.unanswered].includes(correct))
	}
	view.pauseRender=false
}
input.flipCard=(quiz,i)=>quiz[i].correct=enums.unanswered
input.play=(state,startTestAt=Date.now()+((1000*60*60*24)*2))=>
{
	const
	getEntry=curry(logic.getEntry,state.file)

	state.view.pauseRender=true

	//add new cards to level 1
	const unstudiedCards=state.file.data[0].list
		.slice(0,5)// todo:allow # of new cards to be configurable
		.map(getEntry)
	logic.levelUpCards(state.file,unstudiedCards)

	const cards2study=Array(7)
		.fill(1)
		.map((int,i)=>int+ i)
		.map(getEntry)
		//add level prop to remember place
		.map(({id:level,list})=>list
			.map(getEntry)
			.map(item=>Object.assign({level},item))
			// only answer questions on schedule
			.filter(item=>util.daysSince(startTestAt,item.answered||0)>=Math.pow(2,item.level-1))
		)

	state.view.quiz=cards2study
		.map(spark.shuffle)
		.flat()
		.map(item=>Object.assign({correct:enums.unflipped},item))
		.sort(curry(util.sortByProp,'level'))

	state.view.pauseRender=false
}
//todo: spinoff to date.spark
util.daysSince=(date,past)=>Math.round((date-past)/(1000*60*60*24))//ms*sec*min*hrs


output.listItem=({file,view},{id,list,text})=>v.dd({id},v.span({},list.length),text)

output.flashCard=({file,view})=>
{
	const
	currentQuestion=view.quiz.findIndex(({correct})=>[enums.unflipped,enums.unanswered].includes(correct)),
	currentCard=view.quiz[currentQuestion],
	[front]=currentCard.text.split('='),
	flipped=currentCard.correct !==enums.unflipped,
	correct=view.quiz.filter(({correct})=>[enums.correct,enums.graded].includes(correct)).length
	// todo: hide play button when cards are shown
	return [
		v.header({},`${correct}/${view.quiz.length}`),
		v('.card',{data:{flipped,card:JSON.stringify(currentCard)}},
			v('.front.stretch',{on:{click:forceEvtUpdate(()=>input.flipCard(view.quiz,currentQuestion))}},front),
			v('.back.col',{},
				v('.stretch',{},currentCard.text),
				v.footer({class:'row'},
					v.button(
						{
							style:'background:red;',
							on:{
								click:forceEvtUpdate(()=>
									input.answer({file,view},currentQuestion,enums.incorrect)
								)
							}
						},
						'incorrect'
					),
					v.button(
						{
							style:'background:green;',
							on:{click:forceEvtUpdate(()=>input.answer({file,view},currentQuestion,enums.correct))}
						},
						'correct'
					)
				)
			)
		)
	]
}

export default ({file,view})=>
{
	if(view.pauseRender) return []

	const
	getEntry=curry(logic.getEntry,file),
	openLists=['_',...view.paths.list]
	.map(id=>getEntry(id))
	.map(item=>{
		const {id,list}=item

		return v.dl({id},...list.map(getEntry).map(curry(output.listItem,{file,view})))
	}),
	body=view.quiz.length?output.flashCard({file,view}):openLists

	return [
		v.style({},css),
		v.header({},
			v.button({on:{click:()=>input.play({file,view},Date.now())}},'play (5)')
		),
		...body
	]
}
