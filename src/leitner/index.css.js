export default /*css*/ `
/*todo:these need to come from higher up*/
.col{flex-direction:column;}
.row{flex-direction:row;}
.stretch{flex:1 1 auto;}
.shrink{flex:0 0 auto;}

.card
{
	width:300px;
	height:300px;
	border:5px solid #333;
	text-align:center;
	font-size:3em;
}

.card .front
{
	width:300px;
	height:300px;
	background:#434343;
	position:absolute;
	z-index:3;
	-webkit-backface-visibility:hidden;
	backface-visibility:hidden;
}

.card .back
{
	display:flex;

	width:300px;
	height:300px;
	background:#0080b5;
	position:absolute;
	z-index:2;
	transform:rotateY(180deg);
	-webkit-backface-visibility:hidden;
	backface-visibility:hidden;
}

.card[data-flipped="true"] .front 
{
	transform:rotateY(180deg);
	/*only transition if flipped to not show answer on a new card*/
	transition:all 0.8s;
}

.card[data-flipped="true"] .back
{
	transform:rotateY(0deg);
	/*only transition if flipped to not show answer on a new card*/
	transition:all 0.8s;
	z-index:3;
}
`