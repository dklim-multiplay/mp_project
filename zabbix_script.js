// ==UserScript==
// @name         Zabbix Script
// @namespace    http://tampermonkey.net/
// @version      0.1.9.1
// @description  This script adds textarea and buttons on the left. It helps to find machine information and saves searching time.
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
var style_far = "margin-top: 1%";
var style_narrow = "margin-top: 0.3";
var style_black_button = "background-color: black; color: white; position: relative; left: 2%; min-width:6%; max-width:6%";

//url
var url_gameforge_hostname = "https://gameforge.multiplay.co.uk/cgi-adm/machines.pl?opt=MachinesAdminList;event=Online;MachinesFilter_filters=name%23%3A%23";
var url_gameforge_ip = "https://gameforge.multiplay.co.uk/cgi-adm/machines.pl?opt=MachinesAdminList;event=Online;MachinesFilter_filters=ip%23%3A%23";
var url_gameforge_mid = "https://gameforge.multiplay.co.uk/cgi-adm/machines.pl?opt=MachinesAdminList;event=Online;machineid=";
var url_gameforge_serverid = "https://gameforge.multiplay.co.uk/cgi-adm/servers.pl?opt=ServersAdminList;event=Online;serverid=";
var url_gameforge_ref = "https://gameforge.multiplay.co.uk/cgi-adm/machines.pl?opt=MachinesAdminList;event=Online;MachinesFilter_filters=provider_reference%23%3A%23";
var url_procurement_hostname = "https://gameforge.multiplay.co.uk/cgi-adm/machines.pl?opt=MachineProcurementReport;event=Online;MachineProcurementReport_filters=name%23%3A%23";
var url_procurement_ip = "https://gameforge.multiplay.co.uk/cgi-adm/machines.pl?opt=MachineProcurementReport;event=Online;MachineProcurementReport_filters=ip%23%3A%23";
var url_deleted_machines1 = "https://gameforge.multiplay.co.uk/cgi-adm/machines.pl?_aeid=25;opt=MachinesFilter;eventid=25;MachinesFilter_filters=deleted%23%3A%23Yes;MachinesFilter_filters=name%23%3A%23";
var url_deleted_machines2 = ";MachinesFilter_filter_deleted_options=1;MachinesFilter_filter_value=Yes;MachinesFilter_filter_go=Go";
var url_deleted_machinesip1 = "https://gameforge.multiplay.co.uk/cgi-adm/machines.pl?_aeid=25;opt=MachinesFilter;eventid=25;MachinesFilter_filters=deleted%23%3A%23Yes;MachinesFilter_filters=ip%23%3A%23";
var url_deleted_machinesip2 = ";MachinesFilter_filter_deleted_options=1;MachinesFilter_filter_value=Yes;MachinesFilter_filter_go=Go";
var url_logzio1 = "https://app-eu.logz.io/#/dashboard/kibana/discover?_a=(columns:!(message),index:%5BlogzioCustomerIndex%5DYYMMDD,interval:auto,query:(language:lucene,query:%22";
var url_logzio2 = "%22),sort:!('@timestamp',desc))&_g=(refreshInterval:(display:Off,pause:!f,value:0),time:(from:now-4h,mode:quick,to:now))&accountIds=31168&accountIds=31077&accountIds=62777&accountIds=54571&accountIds=31166&accountIds=97966&accountIds=82670&accountIds=30901";
var url_image_menu = "https://gameforge.multiplay.co.uk/events/Online/toolbar.html?sectionid=6;section=;modid=0;admin=0";
var string_sectionid_firefox = "/cgi-adm/servers.pl?opt=ServersAdminList;sectionid=";
var string_sectionid_chrome = "https://zabbix.multiplay.co.uk/cgi-adm/servers.pl?opt=ServersAdminList;sectionid=";

// game image
var game_images1 = "https://gameforge.multiplay.co.uk/cgi-adm/installs.pl?opt=InstallImagesAdminList;sectionid=";
var game_images2 = ";event=Online;block=1";

//browser relibalbe detection
// Opera 8.0+
var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
// Firefox 1.0+
var isFirefox = typeof InstallTrigger !== 'undefined';
// Safari 3.0+ "[object HTMLElementConstructor]"
var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));
// Internet Explorer 6-11
var isIE = /*@cc_on!@*/false || !!document.documentMode;
// Edge 20+
var isEdge = !isIE && !!window.StyleMedia;
// Chrome 1 - 71
var isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
// Blink engine detection
var isBlink = (isChrome || isOpera) && !!window.CSS;

// variables
var option;
var map = new Map();
var string_array = "";
var scraping_array_string = [];
var format_array_string = [];
var select_options;

// regex
var hostname_rx = /^([a-z0-9]+-)+(\.|[a-z0-9]+)+$/;
var ip4_rx = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])/;
var username_rx = /^([aA]dmin(istrator)?|root|[uU]ser)/;
var password_rx = /^(?=.*[a-z])(?=.*[A-Z])\S{8,}/;
var uni_rx;
var reference_rx = /^((SERV|SAU)?-?)((\d{4,6})|([A-Z0-9]*)|([a-z0-9]*))?(-OR)?$/; //need to figure out -> username, ip, hostname
var mid_rx = /^\d{6}$/;
var sid_rx = /^\d{7}$/;
var split_rx = /,\s?|\s+/;

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
//GF Machines (hostname) button in li
var li0 = document.createElement("li");
li0.setAttribute("id", "li0");
li0.setAttribute("style", "min-width: 16%;");
textAreaDiv.parentNode.appendChild(li0);
var copy = document.createElement("input");
copy.type = "button";
copy.value = "COPY";
copy.setAttribute("style", style_black_button);
copy.onclick = copy_all;
var clear = document.createElement("input");
clear.type="button";
clear.value = "CLEAR";
clear.setAttribute("style", style_black_button);
clear.onclick = clear_button;
document.getElementById("li0").appendChild(copy);
document.getElementById("li0").appendChild(clear);

var li1 = document.createElement("li");
li1.setAttribute("id", "li1");
li1.setAttribute("style", style_far);
//textAreaDiv.parentNode.appendChild(li1);///
li0.parentNode.appendChild(li1);
var machines=document.createElement("input");
machines.type="button";
machines.value="GF Machines";
machines.setAttribute("style", style_default_button);
machines.title =" On textarea above, type hostname(s), ip(s), machineid(s) or serverid(s)";
machines.onclick = gotogameforge_machines;
document.getElementById("li1").appendChild(machines);

// Procurement(hostname) button in li
var li2 = document.createElement("li");
li2.setAttribute("id", "li2");
li2.setAttribute("style", style_narrow);
li1.parentNode.appendChild(li2);
var procurement=document.createElement("input");
procurement.type="button";
procurement.value="GF Procurement";
procurement.title =" On textarea above, type hostname(s) or ip(s) ";
procurement.setAttribute("style", style_default_button);
procurement.onclick = gotogameforge_procurement;
document.getElementById("li2").appendChild(procurement);

//GF Deleted button in li
var li3 = document.createElement("li");
li3.setAttribute("id", "li3");
li3.setAttribute("style", style_narrow);
li2.parentNode.appendChild(li3);
var deleted = document.createElement("input");
deleted.type = "button";
deleted.value = "GF Deleted";
deleted.onclick = deleted_button;
deleted.setAttribute("style", style_orange);
document.getElementById("li3").appendChild(deleted);

//Logzio button in li
var li4 = document.createElement("li");
li4.setAttribute("id", "li4");
li4.setAttribute("style", style_narrow);
li3.parentNode.appendChild(li4);
var logzio=document.createElement("input");
logzio.type="button";
logzio.value="Logzio(uuid)";
logzio.onclick = logzio_button;
logzio.setAttribute("style", style_lightblue);
document.getElementById("li4").appendChild(logzio);

//Scraping dropdown list
var li4a = document.createElement("li");
li4a.setAttribute("id", "li4a");
li4a.setAttribute("style", style_far);
li4.parentNode.appendChild(li4a);
var dropdownlist_scraping = document.createElement("SELECT");
dropdownlist_scraping.setAttribute("id", "dropdownlist_scraping");
dropdownlist_scraping.setAttribute("style", style_dropdownlist);
document.getElementById("li4a").appendChild(dropdownlist_scraping);
scraping_dropdown();

//Scraping button in li
var li5 = document.createElement("li");
li5.setAttribute("id", "li5");
li5.setAttribute("style", style_narrow);
li4a.parentNode.appendChild(li5);
var scraping =document.createElement("input");
scraping.type="button";
scraping.value="Scraping";
scraping.onclick = scraping_button;
scraping.setAttribute("style", style_default_button);
document.getElementById("li5").appendChild(scraping);

//select in li
var li7 = document.createElement("li");
li7.setAttribute("id", "li7");
li7.setAttribute("style", "margin-top: 2%");
li5.parentNode.appendChild(li7);
var dropdownlist = document.createElement("SELECT");
dropdownlist.setAttribute("id", "dropdownlist");
dropdownlist.setAttribute("style", style_dropdownlist);
document.getElementById("li7").appendChild(dropdownlist);

//Load images button in li
var li8 = document.createElement("li");
li8.setAttribute("id", "li8");
li8.setAttribute("style", style_narrow);
li7.parentNode.appendChild(li8);
var images =document.createElement("input");
images.type="button";
images.value="Load Images";
images.onclick = images_button;
images.setAttribute("style", style_default_button);
document.getElementById("li8").appendChild(images);
getGameImages();

var li8a = document.createElement("li");
li8a.setAttribute("id", "li8a");
li8a.setAttribute("style", "margin-top: 2%");
li8.parentNode.appendChild(li8a);
var dropdownlist_format = document.createElement("SELECT");
dropdownlist_format.setAttribute("id", "dropdownlist_format");
dropdownlist_format.setAttribute("style", style_dropdownlist);
document.getElementById("li8a").appendChild(dropdownlist_format);
format_dropdown();

var li9 = document.createElement("li");
li9.setAttribute("id", "li9");
li9.setAttribute("style", style_narrow);
li8a.parentNode.appendChild(li9);
var formatting = document.createElement("input");
formatting.type = "button";
formatting.value = "Print CSV";
formatting.onclick = formatting_button;
formatting.setAttribute("style", style_default_button);
document.getElementById("li9").appendChild(formatting);

/*
Functions
*/
function dataValidation(){
    var data = document.getElementsByTagName("TEXTAREA")[0].value.trim();
    var split_data = data.split(split_rx);

    if(split_data == ""){
        alert("Type data");
    }
    else{
        return split_data;
    }
}

function getDeviceInfo(data,url){
    console.log("getDeviceInfo called");
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
                    var testName = getData(xhr_doc,data);
                }
            }}
    });
}

/*
Desc: This function gets the game images and the version number from gameforge. You can simply check the latest version of game images on textarea
*/
function getImageURL(section_id,url){
    console.log("getImageURL called");

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
                    console.log(url);
                }
            }}
    });
}

function getGameImages(){
    console.log("getGameImages called");
    GM.xmlHttpRequest({
        method: 'GET',
        url: url_image_menu,
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
                }
            }}
    });
}

function getImages(doc){
    var mytable = doc.getElementsByClassName("menugrplink");
    var table_length = mytable.length;
    var section_string;
    var map_key;
    var map_value;
    var key_array = [];
    var value_array = [];
    var table_string = [];

    for(var i =0; i< table_length; i++){
        map_key = mytable[i].childNodes[0].title;
        //Browser checking
        if(isChrome){
            section_string = mytable[i].childNodes[0].href.replace(string_sectionid_chrome,"");
        }
        else if(isFirefox){
            section_string = mytable[i].childNodes[0].href.replace(string_sectionid_firefox,"");
        }

        if(section_string[3]==";"){//filling floor section id is xxx
            map_value = section_string.substring(0,3);
        }
        else{
            map_value = section_string.substring(0,4);
        }

        //check if map_value is positive whole numbers
        if(/^\d+$/.test(map_value)==true){
            key_array.push(map_key);
            value_array.push(map_value);
            map.set(map_key, map_value);
        }
    }
    for (var k = 0; k < key_array.length; k++) {
        option = document.createElement('option');
        option.value = option.text = key_array[k];
        dropdownlist.add(option);
    }
}

function getData(doc,hostnames){
   var myTable = doc.getElementsByClassName("itemList");
    myTable[0].setAttribute("id", "myTable");
    var oTable = myTable[0];
    var rowLength = myTable[0].rows.length;
    var option_string;
    var my_hostname;
    var my_ip;
    var my_location;
    var my_dc;
    var my_reference;
    var class_array = [];
    //check dropdownlist_scraping option here
    option_string = select_options; //option_string is local variable

    string_array = "";
    for(var i=1; i<rowLength-1;i++){
        my_hostname = oTable.rows.item(i).cells[2].innerText;
        my_ip = oTable.rows.item(i).cells[3].innerText;
        my_location = oTable.rows.item(i).cells[4].innerText;
        my_dc = oTable.rows.item(i).cells[5].innerText;
        my_reference = oTable.rows.item(i).cells[9].innerText;
        var myMachine = new Machine(my_hostname, my_ip, my_location, my_dc, my_reference);
        class_array.push(myMachine);

        if(option_string == scraping_array_string[1]){
            string_array = string_array + class_array[class_array.length-1].printHostnameIP();
            console.log("string array = " + string_array);
        }
        else if(option_string == scraping_array_string[2]){
            string_array = string_array + class_array[class_array.length-1].printIPHostname();
        }
        else if(option_string == scraping_array_string[3]){
            string_array = string_array + class_array[class_array.length-1].printHostnameIPLocationDC();
        }
        else if(option_string == scraping_array_string[0]){
            string_array = string_array + class_array[class_array.length-1].printMachine()+ "\n";
        }
    }
    textAreaDiv.value = string_array;
}

function getImagesdata(doc){
    console.log("in getImagesdata");
    var name_array = [];
    var image_array = [];
    var version_array=[];
    var my_array = [];
  	var my_string = "";
    var myTable = doc.getElementsByClassName("itemList");
    myTable[0].setAttribute("id", "myTable");
    var oTable = myTable[0];
    var rowLength = myTable[0].rows.length;

    //Result to the Jason file. Check console log for the result
    var jsonStr = '{"Images":[{"game image":"", "version":""}]}';
    var obj = JSON.parse(jsonStr);

    for(var i=1; i<rowLength;i++){
    	name_array.push(oTable.rows.item(i).cells[1].innerText);
    	version_array.push(oTable.rows.item(i).cells[2].innerText);
    }

  	obj['Images'].pop();
  	for(i=0; i<name_array.length; i++){
      my_array.push(name_array[i] + " " + version_array[i]);
      my_string = my_string + name_array[i] + " " + version_array[i] + "\n";
      obj['Images'].push({"game image":name_array[i], "version":version_array[i]});
      jsonStr = JSON.stringify(obj);
    }
	textAreaDiv.value = my_string;
	console.log(jsonStr);
}


function gotogameforge_machines()
{
    var data_result = dataValidation();
    var gameforge;
    if(data_result[0].match(ip4_rx)){
        gameforge = url_gameforge_ip + data_result;
    }
    else if(data_result[0].match(mid_rx)){
        gameforge =url_gameforge_mid + data_result;
    }
    else if(data_result[0].match(sid_rx)){
        gameforge = url_gameforge_serverid + data_result;
    }
    else{
        gameforge = url_gameforge_hostname + data_result;
    }
    window.open(gameforge,'_blank');

}

function gotogameforge_procurement()
{
    var data_result = dataValidation();
    var gameforge = url_procurement_hostname + data_result;

    if(data_result[0].match(ip4_rx)){
        gameforge = url_procurement_ip + data_result;
    }
    else{
        gameforge = url_procurement_hostname + data_result;
    }
    window.open(gameforge,'_blank');
}

function deleted_button()
{
    var data_result = dataValidation();
    var gameforge;
    if(data_result[0].match(ip4_rx)){
        gameforge = url_deleted_machinesip1 + data_result + url_deleted_machinesip2;
    }
    else if(data_result[0].match(mid_rx)){
        //gameforge =url_gameforge_mid + data_result;
    }
    else if(data_result[0].match(sid_rx)){
        //gameforge = url_gameforge_serverid + data_result;
    }
    else{
        gameforge = url_deleted_machines1 + data_result + url_deleted_machines2
    }
    window.open(gameforge,'_blank');
}

function clear_button(){
    textAreaDiv.value='';
}

//testing...
function copy_all(){
        var dummy = document.getElementsByTagName("TEXTAREA")[0];
        dummy.select();
        document.execCommand('copy');
        //dummy.remove();
}
//testing...

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
    var dropdownlist_scraping_id = document.getElementById("dropdownlist_scraping");
    select_options = dropdownlist_scraping_id.options[dropdownlist_scraping_id.selectedIndex].value;
    var url;
    var data_result = dataValidation();
    if(data_result[0].match(ip4_rx)){
        url = url_procurement_ip + data_result;
    }
    else{
        url = url_procurement_hostname + data_result;
    }
    getDeviceInfo(data_result,url);
}

function images_button(){
    console.log("images button clicked");
    var image_name = document.getElementById("dropdownlist");
    var strUser = image_name.options[image_name.selectedIndex].value;
    var section_id = map.get(strUser);
    var url = game_images1 + section_id + game_images2;
    console.log(section_id);
    getImageURL(section_id, url);
}

function scraping_dropdown(){
    scraping_array_string.push("hostnames ip location dc reference");
    scraping_array_string.push("hostnames ip");
    scraping_array_string.push("ip hostnames");
    scraping_array_string.push("hostnames ip location dc");
    for (var k = 0; k < scraping_array_string.length; k++) {
        option = document.createElement('option');
        option.value = option.text = scraping_array_string[k];
        dropdownlist_scraping.add(option);
    }
}

function format_dropdown(){
    format_array_string.push("ip, username, password");
    format_array_string.push("ip, username, \"password\"");
    format_array_string.push("ip, hostname, username, password");
    format_array_string.push("ip, hostname");
    format_array_string.push("ip");
    format_array_string.push("hostname");
    for (var k = 0; k < format_array_string.length; k++) {
        option = document.createElement('option');
        option.value = option.text = format_array_string[k];
        dropdownlist_format.add(option);
    }
}

function formatting_button(){
    console.log("formatting button clicked");

    var machine_info = document.getElementsByTagName("TEXTAREA")[0].value;
    if(machine_info == ""){
        alert("type data");
    }
    else{
        var ipmi_pos = prompt("Please type ipmi position if found");//////////
        //console.log("ipmi pos ======== " + ipmi_pos);////////////////
        var split_machine = machine_info.split("\n");
        var split_data;
        var my_uni = "N/A";
        var my_ref = "N/A";
        var my_hostname = "N/A";
        var my_ip = "N/A";
        var my_username = "N/A";
        var my_password = "N/A";
        var machine_list = [];

        var dropdownlist_format_id = document.getElementById("dropdownlist_format");
        select_options = dropdownlist_format_id.options[dropdownlist_format_id.selectedIndex].value;
        var csv_string="";

        for(var i = 0; i < split_machine.length; i++){
            split_data = split_machine[i].split(split_rx);
            for(var j = 0; j < split_data.length; j++){
                if(split_data[j].match(/^(UNI)[-]?\d*/)){ // need to edit this ex) UNI-xxxxxx
                    my_uni = split_data[j];
                }
                else if(split_data[j].match(username_rx)){
                    my_username = split_data[j];
                }
                else if(split_data[j].match(hostname_rx)){ // need to edit this ex) gg-bri78. gg-sbri02
                    my_hostname = split_data[j];
                    console.log("host name === " + my_hostname);
                }
                else if(split_data[j].match(ip4_rx)){ // need to figure out how to handle IPMI and IP reference
                    if(ipmi_pos != null && split_data[j] == split_data[ipmi_pos-1]){
                        console.log("***ipmi ip === " + split_data[j]);
                    }else{
                        my_ip = split_data[j];
                        console.log("ip address === " + my_ip);
                    }
                }
                else if(split_data[j].match(password_rx)){ //this checks if the string contains at least one lower and upper case
                    my_password = split_data[j];
                }
            }
            var myMachine = new MachineDeploy(my_hostname, my_ip, my_uni,my_username, my_password);
            machine_list.push(myMachine);
        }

        for(var k=0; k < machine_list.length; k++){
            if(select_options == format_array_string[0]){
                csv_string = csv_string + machine_list[k].printCSV() + "\n";
            }
            else if(select_options == format_array_string[1]){
                csv_string = csv_string + machine_list[k].printActivisionCSV() + "\n";
            }
            else if(select_options == format_array_string[2]){
                csv_string = csv_string + machine_list[k].printGGGCSV() + "\n";
            }
            else if(select_options == format_array_string[3]){
                csv_string = csv_string + machine_list[k].printIPHostname() + "\n";
            }
            else if(select_options == format_array_string[4]){
                csv_string = csv_string + machine_list[k].printIP() + "\n";
            }
            else if(select_options == format_array_string[5]){
                csv_string = csv_string + machine_list[k].printHostname() + "\n";
            }
        }
        textAreaDiv.value = csv_string;
    }
}

class Machine{
	constructor(hostname,ip,location,dc,reference){
		this.hostname=hostname;
		this.ip=ip;
		this.location=location;
		this.dc=dc;
		this.reference=reference;
	}

	printMachine(){
		return this.hostname + "\n" + this.ip + "\n" + this.location + "\n" + this.dc + "\n" + this.reference + "\n";
	}
   	printHostnameIP(){
       	return this.hostname + " " + this.ip + "\n";
   	}
	printIPHostname(){
		return this.ip + " " + this.hostname + "\n";
	}
	printHostnameIPLocationDC(){
		return this.hostname + " " + this.ip + " " + this.location + " " + this.dc + "\n";
	}

	get getHostname(){
		return this.hostname;
	}
	set setHostname(hostname){
		this.hostname = hostname;
	}
	get getIP(){
		return this.ip;
	}
	set setIP(ip){
		this.ip = ip;
	}
	get getLocation(){
		return this.location;
	}
	set setLocation(location){
		this.location = location;
	}
	get getDC(){
		return this.dc;
	}
	set setDC(dc){
		this.dc = dc;
	}
	get getReference(){
		return this.reference;
	}
	set setReference(reference){
		this.reference = reference;
	}
}

class MachineDeploy extends Machine{
    constructor(hostname,ip, uni,username,password){
        super(hostname,ip);
        this.uni = uni;
        this.username = username;
        this.password = password;
    }
    show(){
        return this.printMachine() + " in MachineDeploy";
    }
    printCSV(){ //index 0
        return this.ip + ", " + this.username + ", " + this.password;
    }
    printActivisionCSV(){ //index 1
        return this.ip + ", " + this.username + ", \"" + this.password + "\"";
    }
    printGGGCSV(){ //index2
        return this.ip + ", " + this.hostname + ", " + this.username + ", " + this.password;
    }
    printIPHostname(){
        return this.ip + ", " + this.hostname;
    }
    printIP(){
        return this.ip;
    }
    printHostname(){
        return this.hostname;
    }
}
