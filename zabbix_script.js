// ==UserScript==
// @name         Zabbix Script
// @namespace    http://tampermonkey.net/
// @version      0.1.4.1
// @description  Zabbix Script
// @author       dklim
// @match        https://zabbix.multiplay.co.uk/zabbix.php?action=dashboard.view
// @grant        GM.xmlHttpRequest
// @updateURL    https://drive.google.com/file/d/1ELzpn6ptYOaGjbRSxbGFYvnbYXGrIzts/view
// @downloadURL	 https://drive.google.com/file/d/1ELzpn6ptYOaGjbRSxbGFYvnbYXGrIzts/view
// @run-at       document-end
// ==/UserScript==

//testing
var leftDiv = document.getElementsByClassName("dashbrd-grid-widget")[0];

var textAreaDiv = document.createElement("TEXTAREA");
textAreaDiv.setAttribute("style", "min-width: 16%; max-width:16%; min-height: 25%; max-height: 50%; background-color: linear-gradient(to bottom, #fff, #e6e6e6); border-color: grey;");

var textArea = document.getElementsByTagName("TEXTAREA")[0];

if(!textArea){
    leftDiv.parentNode.replaceChild(textAreaDiv, leftDiv);
}

/////
var li1 = document.createElement("li");
li1.setAttribute("id", "li1");
li1.setAttribute("style", "margin-top: 1%");
textAreaDiv.parentNode.appendChild(li1);///
var machines=document.createElement("input");
machines.type="button";
machines.value="GF Machines";
machines.setAttribute("style", "position: relative; left: 2%; min-width:12%");
machines.onclick = gotogameforge_machines;
document.getElementById("li1").appendChild(machines);

var li2 = document.createElement("li");
li2.setAttribute("id", "li2");
li2.setAttribute("style", "margin-top: 0.3%");
li1.parentNode.appendChild(li2);
var procurement=document.createElement("input");
procurement.type="button";
procurement.value="GF Procurement";
procurement.setAttribute("style", "position: relative; left: 2%; min-width:12%");
procurement.onclick = gotogameforge_procurement;
document.getElementById("li2").appendChild(procurement);

var li3 = document.createElement("li");
li3.setAttribute("id", "li3");
li3.setAttribute("style", "margin-top: 0.3%");
li2.parentNode.appendChild(li3);
var deleted = document.createElement("input");
deleted.type = "button";
deleted.value = "GF Deleted";
deleted.onclick = deleted_button;
deleted.setAttribute("style", "position: relative; left: 2%; min-width:12%; background-color: orange");
document.getElementById("li3").appendChild(deleted);

var li4 = document.createElement("li");
li4.setAttribute("id", "li4");
li4.setAttribute("style", "margin-top: 0.3%");
li3.parentNode.appendChild(li4);
var logzio=document.createElement("input");
logzio.type="button";
logzio.value="Logzio(uuid)";
logzio.onclick = logzio_button;
logzio.setAttribute("style", "position: relative; left: 2%; min-width:12%; background-color: lightblue");
document.getElementById("li4").appendChild(logzio);

var li6 = document.createElement("li");
li6.setAttribute("id", "li6");
li6.setAttribute("style", "margin-top: 0.3%");
li4.parentNode.appendChild(li6);
var scraping =document.createElement("input");
scraping.type="button";
scraping.value="Scraping";
scraping.onclick = scraping_button;
scraping.setAttribute("style", "position: relative; left: 2%; min-width:12%");
document.getElementById("li6").appendChild(scraping);

var li9 = document.createElement("li");
li9.setAttribute("id", "li9");
li9.setAttribute("style", "margin-top: 0.3%");
li6.parentNode.appendChild(li9);
var r5image =document.createElement("input");
r5image.type="button";
r5image.value="r5image";
r5image.onclick = r5image_button;
r5image.setAttribute("style", "position: relative; left: 2%; min-width:12%");
document.getElementById("li9").appendChild(r5image);


function getDeviceInfo(){
    console.log("getDeviceInfo called");
    var hostnames = document.getElementsByTagName("TEXTAREA")[0].value;
    var url = "https://gameforge.multiplay.co.uk/cgi-adm/machines.pl?opt=MachineProcurementReport;event=Online;MachineProcurementReport_filters=name%23%3A%23" + hostnames;

    if(hostnames == ""){window.alert("Please provide the info");}

    console.log("url ===== " + url);

    GM.xmlHttpRequest({
        method: 'GET',
        url: url,
        headers: {
            'User-agent': 'Mozilla/5.0 (compatible) Greasemonkey',
            'Accept': 'application/atom+xml,application/xml,text/xml',
        },
        //onload: function(response){
        onreadystatechange: function(response) {
            if (response.readyState === 4) {
                if (response.status == 200) {

                    var range = document.createRange();
                    range.setStartAfter(document.body);
                    var xhr_frag = range.createContextualFragment(response.responseText);
                    var xhr_doc = document.implementation.createDocument(null, 'html', null);
                    xhr_doc.adoptNode(xhr_frag);
                    xhr_doc.documentElement.appendChild(xhr_frag);

                    console.log("callinng testName");

                    var testName = getData(xhr_doc,hostnames);

                    console.log(testName);
                }
            }}
    });
}

function getR5images(){
    console.log("getR5Images called");
    var url = "https://gameforge.multiplay.co.uk/cgi-adm/installs.pl?opt=InstallImagesAdminList;sectionid=1367;event=Online;block=1";

    GM.xmlHttpRequest({
        method: 'GET',
        url: url,
        headers: {
            'User-agent': 'Mozilla/5.0 (compatible) Greasemonkey',
            'Accept': 'application/atom+xml,application/xml,text/xml',
        },
        //onload: function(response){
        onreadystatechange: function(response) {
            if (response.readyState === 4) {
                if (response.status == 200) {

                    var range = document.createRange();
                    range.setStartAfter(document.body);
                    var xhr_frag = range.createContextualFragment(response.responseText);
                    var xhr_doc = document.implementation.createDocument(null, 'html', null);
                    xhr_doc.adoptNode(xhr_frag);
                    xhr_doc.documentElement.appendChild(xhr_frag);

                    console.log("callinng r5 game images");

                    var testName = getR5data(xhr_doc);

                    console.log(testName);
                  	console.log("https://gameforge.multiplay.co.uk/cgi-adm/installs.pl?opt=InstallImagesAdminList;sectionid=1367;event=Online;block=1");
                }
            }}
    });
}


function getData(doc,hostnames){

    console.log("getData called, hostnames= " + hostnames);
    var data = doc.getElementsByClassName('scrolltable');
  	var data_array = data[0].innerText.split("\n");

  	var my_array = [];

  	for(var i=0; i < data_array.length; i++){
    	if(data_array[i]==""){}
      else if(data_array[i]=="\t"){}
      else if(data_array[i]=="\t\t"){}
      else{
      	my_array.push(data_array[i].trim());
      }
    }
  	console.log(my_array[5]);

  	//2,3,4,5,9
		textAreaDiv.value = "ip: " + my_array[3] + "\nhostname: " + my_array[2] + "\nlocation: " + my_array[4] + "\nDC: " + my_array[5] + "\nreference: " + my_array[9];
  	var t_ip = document.createTextNode(my_array[3]);
    //td2.appendChild(t_ip);

  	var t_dc = document.createTextNode(my_array[5]);
    //td4.appendChild(t_dc);

  	var t_ref = document.createTextNode(my_array[9]);
    //td5.appendChild(t_ref);

}

function getR5data(doc){

    console.log("in getR5ata");


    var myTable = doc.getElementsByClassName("itemList");
    myTable[0].setAttribute("id", "myTable");
    var oTable = myTable[0];
		var r5_array = [];
  	var r5_string = "";
    var rowLength = myTable[0].rows.length;

    var parseSplit;
    var parseArrayR5 = [];
    var jsonStrR5 = '{"R5Image":[{"game image":"", "version":""}]}';
    var obj = JSON.parse(jsonStrR5);

    var image_array = [];
    var version_array=[];
    for(i=1; i<rowLength;i++){
    	r5_array.push(oTable.rows.item(i).cells[1].innerText);
    	version_array.push(oTable.rows.item(i).cells[2].innerText);
    }
		console.log(r5_array);
  	console.log(version_array);

  	var my_array = [];
  	var my_string = "";
  	obj['R5Image'].pop();
  	for(i=1; i<r5_array.length; i++){
    	my_array.push(r5_array[i] + " " + version_array[i]);
      my_string = my_string + r5_array[i] + " " + version_array[i] + "\n";
      obj['R5Image'].push({"game image":r5_array[i], "version":version_array[i]});
      jsonStrR5 = JSON.stringify(obj);
    }

  	console.log(my_array);
  	textAreaDiv.value = my_string;
  console.log(jsonStrR5);
}


function gotogameforge_machines()
{
    var hostnames = document.getElementsByTagName("TEXTAREA")[0].value;
    hostnames = hostnames.replace(/\n/g,",");
    console.log(hostnames);
    var gameforge = "https://gameforge.multiplay.co.uk/cgi-adm/machines.pl?opt=MachinesAdminList;event=Online;MachinesFilter_filters=name%23%3A%23"+hostnames
    if(hostnames != ""){
        window.open(gameforge,'_blank');
    }
    else{
        alert("Type hostname");
    }
}

function gotogameforge_procurement()
{
    var hostnames = document.getElementsByTagName("TEXTAREA")[0].value;
    hostnames = hostnames.replace(/\n/g,",");
    var gameforge = "https://gameforge.multiplay.co.uk/cgi-adm/machines.pl?opt=MachineProcurementReport;event=Online;MachineProcurementReport_filters=name%23%3A%23"+hostnames
    if(hostnames!=""){
        window.open(gameforge,'_blank');
    }
    else{
        alert("Type hostname");
    }
}

function deleted_button()
{
    var hostnames = document.getElementsByTagName("TEXTAREA")[0].value;
    hostnames = hostnames.replace(/\n/g,",");
    var gameforge = "https://gameforge.multiplay.co.uk/cgi-adm/machines.pl?_aeid=25;opt=MachinesFilter;eventid=25;MachinesFilter_filters=deleted%23%3A%23Yes;MachinesFilter_filters=name%23%3A%23"+hostnames + ";MachinesFilter_filter_deleted_options=1;MachinesFilter_filter_value=Yes;MachinesFilter_filter_go=Go";
    if(hostnames!=""){
        window.open(gameforge,'_blank');
    }
    else{
        alert("Type hostname");
    }
}

function clear_button()
{
    textAreaDiv.value='';
}

function logzio_button(){
    var uuid = document.getElementsByTagName("TEXTAREA")[0].value;
    uuid = uuid.replace(/\n/g,",");
    var uuid_logzio = "https://app-eu.logz.io/#/dashboard/kibana/discover?_a=(columns:!(message),index:%5BlogzioCustomerIndex%5DYYMMDD,interval:auto,query:(language:lucene,query:%22"+uuid+ "%22),sort:!('@timestamp',desc))&_g=(refreshInterval:(display:Off,pause:!f,value:0),time:(from:now-4h,mode:quick,to:now))&accountIds=31168&accountIds=31077&accountIds=62777&accountIds=54571&accountIds=31166&accountIds=97966&accountIds=82670&accountIds=30901"
;
    if(uuid!=""){
        window.open(uuid_logzio,'_blank');
    }
    else{
        alert("Type uuid");
    }
}


function scraping_button(){
	getDeviceInfo();

}

function r5image_button(){
  getR5images();

}
