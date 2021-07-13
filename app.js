const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json());

const rawdata = fs.readFileSync('./data.json');
const data = JSON.parse(rawdata);

function getTodayString()
{
	const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];
  const today = new Date();
  let datestring = "";
  datestring+=(String(today.getFullYear())+"-");
  const monthnum = today.getMonth()+1;
  if (monthnum<=9) datestring+="0";
  datestring+=(String(monthnum)+"-");
  datestring+=String(today.getDate());
  return datestring;
}

function updateData()
{
	fs.writeFile ("data.json", JSON.stringify(data,null,"\t"), function(err) {
    if (err) throw err;
    console.log('Data was successfully saved.');
    });
}

app.get('/',(req,res)=>{
	res.send('hi siema!');
});

app.get('/api/comments/:vid',(req,res)=>{
	const found = data.comments.filter(el => el.vid == req.params.vid)
	const obj = JSON.stringify(found);
	res.send(obj);
});

app.post('/api/comments',(req,res)=>{
	const newcomment = {
		id: data.comments.length + 1,
		date: getTodayString(),
		vid: req.body.vid,
		mark: req.body.mark,
		times: req.body.times,
		comment: req.body.comment,
		sources: req.body.sources
	};
	data.comments.push(newcomment);
	res.send(newcomment);
	updateData();
});


const port = process.env.PORT || 3000;
app.listen(port,() => console.log(`listening on port ${port}...`));