// ==UserScript==
// @name         Text Formatting
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *
// @grant        none
// ==/UserScript==

//index
var ipmi_index;
var reference_index;
var ip_index;
var password_index;

var format_array_string=[];
var option;
var select_options;
var style_textArea = "min-width: 80%; max-width:80%; min-height: 25%; max-height: 50%; background-color: linear-gradient(to bottom, #fff, #e6e6e6); border-color: grey";
var style_default_button = "position: relative; left: 2%; min-width:20%; max-width:20%";
var textAreaDiv = document.createElement("TEXTAREA");
var textField = document.createElement("INPUT");
textField.setAttribute("type", "text");
document.body.appendChild(textField);

textAreaDiv.setAttribute("style", style_textArea);
textAreaDiv.setAttribute("id", "textarea");
document.body.appendChild(textAreaDiv);

var mybutton=document.createElement("input");
mybutton.type="button";
mybutton.value="Formatting";
mybutton.setAttribute("style", style_default_button);
mybutton.onclick = mybutton_onclick;
document.body.appendChild(mybutton);

var dropdownlist_format = document.createElement("SELECT");
dropdownlist_format.setAttribute("id", "dropdownlist_format");
dropdownlist_format.setAttribute("style", style_default_button);
document.body.appendChild(dropdownlist_format);
format_dropdown();

function find_title_index(){
    var text_string = textField.value;


    var split_text_string = text_string.split(",");

    console.log("text = " + split_text_string);
    console.log("split_text_string length = " + split_text_string.length);

    for(var i = 0 ; i < split_text_string.length; i++){
        if(split_text_string[i].match(/(Order)?(\s)?([Rr]eference)(\s)?(id|ID)?/)){
            reference_index = i;
            console.log("index of reference = " + i);
        }
        else if(split_text_string[i].match(/(ipmi|IPMI)(\s)?(ip|IP)?/)){
            ipmi_index = i; /// ?
            console.log("index of ipmi = " + i);
        }
        else if(split_text_string[i].match(/(IP|ip)(\s)?([aA]ddress)?/)){
            ip_index = i;
            console.log("index of ip = " + i);

        }
        else if(split_text_string[i].match(/([pP]assword)/)){
            password_index = i;
            console.log("index of password = " + i);
        }
        /*
        else if(split_text_string[i].match()){

        }
        else if(split_text_string[i].match()){

        }
        */
    }
}

function mybutton_onclick(){
    console.log("mybutton clicked");
    find_title_index();
    console.log("ipmi index ==== " + ipmi_index); //need to figure out when there is no title index*************

    var text_string = textAreaDiv.value;
    //console.log("test string = " + text_string + " length = " + text_string.length);
    //var split_text = text_string.split(/(,| )/);
    var split_text = text_string.split("\n");
    //console.log("split text = "+ split_text + " length = " + split_text.length);
    var split_data;
    var my_uni = "";
    var my_ref = "";
    var my_hostname = "";
    var my_ip = "";
    var my_username = "";
    var my_password = "";
    var machine_list = [];
    var uni_list=[];
    var ref_list=[];
    var hostname_list=[];
    var ip_list=[];
    var username_list=[];
    var password_list=[];

    var dropdownlist_format_id = document.getElementById("dropdownlist_format");
    select_options = dropdownlist_format_id.options[dropdownlist_format_id.selectedIndex].value;
    //console.log("select = " + select_options);
    for(var t=0; t < format_array_string.length; t++){
        if(select_options == format_array_string[t]){
            //console.log("index of dropdownlist = " + t);
        }
    }

    var csv_string="";
        for(var i = 0; i < split_text.length; i++){
        //split_data = split_text[i].split(/(,|\s+)/);
        split_data=split_text[i].split(/,\s?|\s+/);
        console.log("split data length = "+split_data.length);
        console.log("split data = " + split_data);

        for(var j = 0; j < split_data.length; j++){
            //console.log("j = " + j + " split_data = " + split_data[j]);
            if(split_data[j].match(/^(UNI)\d*/)){
                //my_uni = my_uni + split_data[j] + " ";////////
                my_uni = split_data[j];
                //console.log("myuni = " + my_uni);
            }
            else if(split_data[j].match(/([aA]dministrator|root|admin)/)){
                //my_username = my_username + split_data[j] + " ";/////
                my_username = split_data[j];
                //console.log("myusername " + my_username);
            }
            else if(split_data[j].match(/([\w]*-){2}[\d]*/)){
               //my_hostname = my_hostname + split_data[j] + " ";///////
                my_hostname = split_data[j];
                //console.log("myhostname = " + my_hostname);
            }
            else if(split_data[j].match(/^(\d{1,3}.){3}(\d{1,3})/)){
                //my_ip = my_ip + split_data[j] + " ";/////////
                if(split_data[j] == split_data[ipmi_index]){ /// need to figure out when ther is no test field data at all
                    console.log("***ipmi ip = " + split_data[j]);
                }
                else{
                    my_ip = split_data[j];
                }
                //console.log("myip = " + my_ip);
            }
            //else if (!split_data[j].match(/(\,|\/|(\s+)|(^(\d+)$)|(UNI\d+)|([aA]dministrator|root|admin)|(\d{1,3}.){3}(\d{1,3})|([\w]*-){2}[\d]*)/)){
            else if(split_data[j].match(/^(?=.*[a-z])(?=.*[A-Z])\S{8,}/)){
            //if(split_data[j].match(/[\w[!@#$%^&\*\(\)\-\=\_\+\;\'\:]?]{8,16}$/)){
                //my_password = my_password + split_data[j] + " ";
                my_password = split_data[j];
                //console.log("mypassword = " + my_password);
            }
            //console.log("myMachine = " + myMachine.printActivisionCSV());
            //console.log("i = " + i + " j = " + j);
        }
            var myMachine = new MachineDeploy(my_hostname, my_ip, my_uni,my_username, my_password);
            machine_list.push(myMachine);
    }

    textAreaDiv.value="";
    for(var k=0; k < machine_list.length; k++){
        //console.log("CSV " + machine_list[k].printActivisionCSV());
        csv_string = csv_string + machine_list[k].printActivisionCSV() + "\n";

    }
    textAreaDiv.value = csv_string;

}

function format_dropdown(){
    format_array_string.push("ip,username,password");
    format_array_string.push("ip,username,\"password\"");
    format_array_string.push("ip,hostname,username,password");
    for (var k = 0; k < format_array_string.length; k++) {
        option = document.createElement('option');
        option.value = option.text = format_array_string[k];
        dropdownlist_format.add(option);
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
		return this.hostname + " " + this.ip + " " + this.location + " " + this.dc + " " + this.reference + "\n";
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
	printMachine(){
		return this.hostname + " " + this.ip + " " + this.location + " " + this.dc + " " + this.reference + "\n";
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
    printActivisionCSV(){
        return this.ip + "," + this.username + ",\"" + this.password + "\"";
    }
    printGGGCSV(){
        return this.ip + "," + this.hostname + "," + this.username + "," + this.password + "\"";
    }
    printCSV(){
        return this.ip + "," + this.username + "," + this.password + "\"";
    }
}
