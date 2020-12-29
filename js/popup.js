var browser = browser || chrome;
var initial_data = ["http://example.com/", "https://www.salesforce.com/", "https://theuselessweb.com/", "https://www.imf-formacion.com/", "http://192.168.0.2/" ];
var blacklist = [];


function resetBlacklist() {
    browser.storage.local.set({
        blacklist: initial_data
    }, function() {
        blacklist = initial_data;
    });
}



function iterateAndCloseTabs(currentTab) {

    browser.tabs.query({}, function(tabs) { 
     if (currentTab!= null) tabs.splice(tabs.indexOf(currentTab), 1);
     let delFlag = false;
     for (let i = blacklist.length - 1; i>=0; i--){
        for (let j = tabs.length - 1; j>=0; j--) {
            if (blacklist[i] == tabs[j].url)  {
                browser.tabs.remove(tabs[j].id);
                tabs.splice(j,1);
                delFlag = true;
            }
        }
        if (delFlag==true) {
            blacklist.splice(i, 1);
            delFlag = false;
        }
    }
     });
}


function addUrl () {
    let url = document.getElementById("bInput").value;
    if (url.includes("chrome://")) return ;
    if (url!=null && url.length!=0) {
        if (validateUrl(url)) {
            url = trURL(url);
            blacklist.push(url);
            browser.storage.local.set({ blacklist: blacklist });
            iterateAndCloseTabs(null);
        }
        else {
            console.log("Bad url..");
        }
    }
}

function add() {
  browser.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        console.log("Blacklist size - add(): "+ blacklist.length);
        if ((tabs[0].url).includes("chrome://")) return ;

        if (blacklist.indexOf(tabs[0].url)== -1) {
            console.log(tabs[0]);
            blacklist.push(tabs[0].url);
            browser.storage.local.set({ blacklist: blacklist }, function() {
            iterateAndCloseTabs(tabs[0]);
            browser.tabs.remove(tabs[0].id);
            });
        }
      }); 
}



window.onload = function() {
  //  alert("there");
    document.getElementById("di").addEventListener("click", add);
    document.getElementById("refresh").addEventListener("click", resetBlacklist);
    document.getElementById("bButton").addEventListener("click", addUrl);
    
    browser.storage.local.get(data => {
        if (data.blacklist)   blacklist = data.blacklist;
    });
}