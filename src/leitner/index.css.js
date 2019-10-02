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

dd{margin-inline-start:0;}

.list
{
	background:#f8f8f8;
	--item-height:2rem;
	--item-padding:0.5rem;
	--color-black:#222;
	--color-white:#fff;
}

.list .item
{
	border-bottom:1px solid #222;
	color:var(--color-black);
	display:flex;
	flex-direction:row;
	height:var(--item-height);
}

.list .item .icon
{
	color:var(--color-white);
	display:flex;
	flex-direction:column;
	height:100%;
	justify-content:center;
	text-align:center;
	width:var(--item-height);
}

.list .item .desc
{
	display:flex;
	flex-direction:column;
	flex:1 1 auto;
	justify-content:center;
	padding:0 var(--item-padding);
	position:relative;
}

.list .item .desc::after
{
	content:'>';
	display:flex;
	flex-direction:column;
	font-size:0.5rem;
	height:100%;
	justify-content:center;
	position:absolute;
	right:0;
	text-align:center;
	top:0;
	width:var(--item-padding);
}

[id="0"] .icon{background:#222; color:var(--color-white); }
[id="1"] .icon{background:hsl(0,100%,60%);}
[id="2"] .icon{background:hsl(24,100%,60%);}
[id="3"] .icon{background:hsl(48,100%,60%);}
[id="4"] .icon{background:hsl(93,100%,60%);}
[id="5"] .icon{background:hsl(192,100%,60%);}
[id="6"] .icon{background:hsl(275,100%,60%);}
[id="7"] .icon{background:hsl(335,100%,60%);}
[id="8"] .icon{background:var(--color-white);}
`