// ==UserScript==
// @name         Zabbix Script
// @namespace    http://tampermonkey.net/
// @version      0.1.7.1
// @description  This script adds text area and buttons on the left. It helps to find machine information and saves searching time.
// @author       dk.lim@unity3d.com
// @match        https://zabbix.multiplay.co.uk/zabbix.php?action=dashboard.view
// @grant        GM.xmlHttpRequest
// @updateURL    https://raw.githubusercontent.com/skylimdg89/mp_project/master/zabbix_script.js
// @downloadURL	 https://raw.githubusercontent.com/skylimdg89/mp_project/master/zabbix_script.js
// @run-at       document-end
// ==/UserScript==

//styles
var style_default_button = "position: relative; left: 2%; min-width:12%; max-width:12%";
var style_lightblue = "position: relative; left: 2%; min-width:12%; background-color: lightblue";
var style_textArea = "min-width: 16%; max-width:16%; min-height: 25%; max-height: 50%; background-color: linear-gradient(to bottom, #fff, #e6e6e6); border-color: grey";
var style_orange = "position: relative; left: 2%; min-width:12%; background-color: orange";
var style_dropdownlist = "position: relative; left: 2%; min-width:12%; max-width:12%";

//url
var url_gameforge_hostname = "https://gameforge.multiplay.co.uk/cgi-adm/machines.pl?opt=MachinesAdminList;event=Online;MachinesFilter_filters=name%23%3A%23";
var url_gameforge_ip = "https://gameforge.multiplay.co.uk/cgi-adm/machines.pl?opt=MachinesAdminList;event=Online;MachinesFilter_filters=ip%23%3A%23";
var url_procurement_hostname = "https://gameforge.multiplay.co.uk/cgi-adm/machines.pl?opt=MachineProcurementReport;event=Online;MachineProcurementReport_filters=name%23%3A%23";
var url_procurement_ip = "https://gameforge.multiplay.co.uk/cgi-adm/machines.pl?opt=MachineProcurementReport;event=Online;MachineProcurementReport_filters=ip%23%3A%23";
var url_deleted_machines1 = "https://gameforge.multiplay.co.uk/cgi-adm/machines.pl?_aeid=25;opt=MachinesFilter;eventid=25;MachinesFilter_filters=deleted%23%3A%23Yes;MachinesFilter_filters=name%23%3A%23";
var url_deleted_machines2 = ";MachinesFilter_filter_deleted_options=1;MachinesFilter_filter_value=Yes;MachinesFilter_filter_go=Go";
var url_logzio1 = "https://app-eu.logz.io/#/dashboard/kibana/discover?_a=(columns:!(message),index:%5BlogzioCustomerIndex%5DYYMMDD,interval:auto,query:(language:lucene,query:%22";
var url_logzio2 = "%22),sort:!('@timestamp',desc))&_g=(refreshInterval:(display:Off,pause:!f,value:0),time:(from:now-4h,mode:quick,to:now))&accountIds=31168&accountIds=31077&accountIds=62777&accountIds=54571&accountIds=31166&accountIds=97966&accountIds=82670&accountIds=30901";
var url_image_menu = "https://gameforge.multiplay.co.uk/events/Online/toolbar.html?sectionid=6;section=;modid=0;admin=0";
var string_sectionid = "/cgi-adm/servers.pl?opt=ServersAdminList;sectionid=";

// game image
var game_images1 = "https://gameforge.multiplay.co.uk/cgi-adm/installs.pl?opt=InstallImagesAdminList;sectionid=";
var game_images2 = ";event=Online;block=1";

// section id
//var sectionid_r5 = "1367";
//var sectionid_stones = "1355";
//var sectionid_lonecho = "1343";

//Replaces leftDiv with text area and buttons
var leftDiv = document.getElementsByClassName("dashbrd-grid-widget")[0]; //existing div on the left
var textAreaDiv = document.createElement("TEXTAREA");
textAreaDiv.setAttribute("style", style_textArea);

var textArea = document.getElementsByTagName("TEXTAREA")[0];

if(!textArea){
    leftDiv.parentNode.replaceChild(textAreaDiv, leftDiv);
}

/*
Creates list items and adds buttons
*/
var li1 = document.createElement("li");
li1.setAttribute("id", "li1");
li1.setAttribute("style", "margin-top: 1%");
textAreaDiv.parentNode.appendChild(li1);///
var machines=document.createElement("input");
machines.type="button";
machines.value="GF Machines (hostname)";
machines.setAttribute("style", style_default_button);
machines.onclick = gotogameforge_machines;
document.getElementById("li1").appendChild(machines);

var li1a = document.createElement("li");
li1a.setAttribute("id", "li1a");
li1a.setAttribute("style", "margin-top: 0.3%");
textAreaDiv.parentNode.appendChild(li1a);///
var machines_ip=document.createElement("input");
machines_ip.type="button";
machines_ip.value="GF Machines (ip)";
machines_ip.setAttribute("style", style_default_button);
machines_ip.onclick = gotogameforge_machinesip;
document.getElementById("li1a").appendChild(machines_ip);

var li2 = document.createElement("li");
li2.setAttribute("id", "li2");
li2.setAttribute("style", "margin-top: 0.3%");
li1a.parentNode.appendChild(li2);
var procurement=document.createElement("input");
procurement.type="button";
procurement.value="Procurement (hostname)";
procurement.setAttribute("style", style_default_button);
procurement.onclick = gotogameforge_procurement;
document.getElementById("li2").appendChild(procurement);

var li2a = document.createElement("li");
li2a.setAttribute("id", "li2a");
li2a.setAttribute("style", "margin-top: 0.3%");
li2.parentNode.appendChild(li2a);
var procurement_ip=document.createElement("input");
procurement_ip.type="button";
procurement_ip.value="Procurement (ip)";
procurement_ip.setAttribute("style", style_default_button);
procurement_ip.onclick = gotogameforge_procurementip;
document.getElementById("li2a").appendChild(procurement_ip);

var li3 = document.createElement("li");
li3.setAttribute("id", "li3");
li3.setAttribute("style", "margin-top: 0.3%");
li2a.parentNode.appendChild(li3);
var deleted = document.createElement("input");
deleted.type = "button";
deleted.value = "GF Deleted";
deleted.onclick = deleted_button;
deleted.setAttribute("style", style_orange);
document.getElementById("li3").appendChild(deleted);

var li4 = document.createElement("li");
li4.setAttribute("id", "li4");
li4.setAttribute("style", "margin-top: 0.3%");
li3.parentNode.appendChild(li4);
var logzio=document.createElement("input");
logzio.type="button";
logzio.value="Logzio(uuid)";
logzio.onclick = logzio_button;
logzio.setAttribute("style", style_lightblue);
document.getElementById("li4").appendChild(logzio);

var li5 = document.createElement("li");
li5.setAttribute("id", "li5");
li5.setAttribute("style", "margin-top: 0.3%");
li4.parentNode.appendChild(li5);
var scraping =document.createElement("input");
scraping.type="button";
scraping.value="Scraping";
scraping.onclick = scraping_button;
scraping.setAttribute("style", style_default_button);
document.getElementById("li5").appendChild(scraping);

var li6 = document.createElement("li");
li6.setAttribute("id", "li6");
li6.setAttribute("style", "margin-top: 0.3%");
li5.parentNode.appendChild(li6);
var r5image =document.createElement("input");
r5image.type="button";
r5image.value="r5image";
r5image.onclick = r5image_button;
r5image.setAttribute("style", style_default_button);
//document.getElementById("li6").appendChild(r5image);

///testing...
var li7 = document.createElement("li");
li7.setAttribute("id", "li7");
li7.setAttribute("style", "margin-top: 0.3%");
li6.parentNode.appendChild(li7);
var dropdownlist = document.createElement("SELECT");
dropdownlist.setAttribute("id", "dropdownlist");
//dropdownlist.setAttribute("style", style_default_button);
dropdownlist.setAttribute("style", style_dropdownlist);

document.getElementById("li7").appendChild(dropdownlist);

var li8 = document.createElement("li");
li8.setAttribute("id", "li8");
li8.setAttribute("style", "margin-top: 0.3%");
li7.parentNode.appendChild(li8);
var images =document.createElement("input");
images.type="button";
images.value="Load Images";
images.onclick = images_button;
images.setAttribute("style", style_default_button);
document.getElementById("li8").appendChild(images);

///
/*
*/
var option;
var map= new Map();
getGameImages();
/*
*/


/*
Functions
*/
function getDeviceInfo(){
    console.log("getDeviceInfo called");
    var hostnames = document.getElementsByTagName("TEXTAREA")[0].value;
    var url = url_procurement_hostname + hostnames;
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

/*
Desc: This function gets the game images and the version number. You can simply check the latest version of game images
*/
function getImageURL(section_id){
    console.log("getR5Images called");
    //r5 game images
    //var url = game_images1 + sectionid_r5 + game_images2;
    var url = game_images1 + section_id + game_images2;
    console.log(section_id);
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

                    console.log("callinng game images");

                    var testName = getImagesdata(xhr_doc);

                    console.log(testName);
                    console.log(url);
                }
            }}
    });
}

/* testing
*/
function getGameImages(){
    console.log("getGameImages called");
    var url = url_image_menu;
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

                    var testName = getImages(xhr_doc);

                    //console.log(testName);
                }
            }}
    });
}

function getImages(doc){

    /*
    */
    var mytable = doc.getElementsByClassName("menugrplink");

    var table_length = mytable.length;
    var table_string;
    var split_string;
    var section_string;

    var map_key;
    var map_value;
    var section_key;
    var key_array=[];
    var value_array=[];

    for(var i = 25; i < 135; i++){
        table_string = mytable[i].innerHTML;
        split_string = table_string.split("\"");

        for(var j=0; j < split_string.length; j++){
            if(split_string[j] == " title="){
                map_key = split_string[j+1];
                key_array.push(map_key);
            }
            if(split_string[j].includes(string_sectionid) == true){
                section_string = split_string[j].replace(string_sectionid,"");
                map_value = section_string.substring(0,4);
                value_array.push(map_value);
            }
            map.set(map_key, map_value);
        }

    }
    //console.log(key_array);
    //console.log(value_array);

    for (var k = 0; k < key_array.length; k++) {
        option = document.createElement('option');
        option.value = option.text = key_array[k];
        dropdownlist.add(option);
    }
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

    //testing...
  	//2,3,4,5,9
	textAreaDiv.value = "ip: " + my_array[3] + "\nhostname: " + my_array[2] + "\nlocation: " + my_array[4] + "\nDC: " + my_array[5] + "\nreference: " + my_array[9];
  	var t_ip = document.createTextNode(my_array[3]);
    	//td2.appendChild(t_ip);

  	var t_dc = document.createTextNode(my_array[5]);
    	//td4.appendChild(t_dc);

  	var t_ref = document.createTextNode(my_array[9]);
    	//td5.appendChild(t_ref);

}

function getImagesdata(doc){

    console.log("in getR5ata");

    var myTable = doc.getElementsByClassName("itemList");
    myTable[0].setAttribute("id", "myTable");
    var oTable = myTable[0];
	var name_array = [];
  	var r5_string = "";
    var rowLength = myTable[0].rows.length;

    var parseSplit;
    var parseArrayR5 = [];
    var jsonStr = '{"Images":[{"game image":"", "version":""}]}';
    var obj = JSON.parse(jsonStr);

    var image_array = [];
    var version_array=[];
    for(var i=1; i<rowLength;i++){
    	name_array.push(oTable.rows.item(i).cells[1].innerText);
    	version_array.push(oTable.rows.item(i).cells[2].innerText);
    }

  	var my_array = [];
  	var my_string = "";
  	obj['Images'].pop();
  	for(i=0; i<name_array.length; i++){
      my_array.push(name_array[i] + " " + version_array[i]);
      my_string = my_string + name_array[i] + " " + version_array[i] + "\n";
      obj['Images'].push({"game image":name_array[i], "version":version_array[i]});
      jsonStr = JSON.stringify(obj);
    }

	console.log(my_array);
	textAreaDiv.value = my_string;
	console.log(jsonStr);
}


function gotogameforge_machines()
{
    var hostnames = document.getElementsByTagName("TEXTAREA")[0].value;
    hostnames = hostnames.replace(/\n/g,",");
    console.log(hostnames);
    var gameforge = url_gameforge_hostname + hostnames
    if(hostnames != ""){
        window.open(gameforge,'_blank');
    }
    else{
        alert("Type hostname");
    }
}

function gotogameforge_machinesip()
{
    var ips = document.getElementsByTagName("TEXTAREA")[0].value;
    ips = ips.replace(/\n/g,",");
    console.log(ips);
    var gameforge = url_gameforge_ip + ips;
    if(ips != ""){
        window.open(gameforge,'_blank');
    }
    else{
        alert("Type ip address");
    }
}

function gotogameforge_procurement()
{
    var hostnames = document.getElementsByTagName("TEXTAREA")[0].value;
    hostnames = hostnames.replace(/\n/g,",");
    var gameforge = url_procurement_hostname + hostnames;

    if(hostnames!=""){
        window.open(gameforge,'_blank');
    }
    else{
        alert("Type hostname");
    }
}

function gotogameforge_procurementip()
{
    var hostnames = document.getElementsByTagName("TEXTAREA")[0].value;
    hostnames = hostnames.replace(/\n/g,",");
    var gameforge_ip= url_procurement_ip + hostnames;
    if(hostnames!=""){
        window.open(gameforge_ip,'_blank');
    }
    else{
        alert("Type hostname");
    }
}

function deleted_button()
{
    var hostnames = document.getElementsByTagName("TEXTAREA")[0].value;
    hostnames = hostnames.replace(/\n/g,",");
    var gameforge = url_deleted_machines1 + hostnames + url_deleted_machines2;
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
    var uuid_logzio = url_logzio1 + uuid + url_logzio2;

    if(uuid!=""){
        window.open(uuid_logzio,'_blank');
    }
    else{
        alert("Type data");
    }
}

function scraping_button(){
	getDeviceInfo();

}

function r5image_button(){
  //getImageURL();

}

function images_button(){
    console.log("images button clicked");
    var image_name = document.getElementById("dropdownlist");
    var strUser = image_name.options[image_name.selectedIndex].value;
    var section_id = map.get(strUser);
    getImageURL(section_id);
}
