/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 73.54387134405466, "KoPercent": 26.45612865594534};
    var dataset = [
        {
            "label" : "KO",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "OK",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.2614365469544205, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.1780821917808219, 500, 1500, "SearchAll-2"], "isController": false}, {"data": [0.11213991769547325, 500, 1500, "Categories"], "isController": false}, {"data": [0.5741071428571428, 500, 1500, "SearchAll-1"], "isController": false}, {"data": [0.8161157024793388, 500, 1500, "Categories-0"], "isController": false}, {"data": [0.4035714285714286, 500, 1500, "SearchAll-0"], "isController": false}, {"data": [0.14784394250513347, 500, 1500, "Login"], "isController": false}, {"data": [0.7066115702479339, 500, 1500, "Login-0"], "isController": false}, {"data": [0.8863636363636364, 500, 1500, "Login-1"], "isController": false}, {"data": [0.4690082644628099, 500, 1500, "Login-2"], "isController": false}, {"data": [0.1843679880329095, 500, 1500, "\/Default-0"], "isController": false}, {"data": [0.0, 500, 1500, "\/Default"], "isController": false}, {"data": [0.0, 500, 1500, "\/Default-2"], "isController": false}, {"data": [0.12602842183994017, 500, 1500, "\/Default-1"], "isController": false}, {"data": [0.0, 500, 1500, "SearchAll"], "isController": false}, {"data": [0.3201663201663202, 500, 1500, "Categories-2"], "isController": false}, {"data": [0.875, 500, 1500, "Categories-1"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 12001, 3175, 26.45612865594534, 706939.1315723695, 15, 3647187, 3167.0, 3643821.0, 3645019.9, 3645489.98, 3.290143742626922, 56.49674193248584, 0.8643564751213207], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["SearchAll-2", 438, 113, 25.799086757990867, 485302.06621004577, 940, 3635730, 2287.5, 3633752.7, 3634279.1, 3634814.74, 0.12034699500697353, 6.943071097322801, 0.018487594436671653], "isController": false}, {"data": ["Categories", 486, 50, 10.2880658436214, 3888.04732510288, 15, 314053, 2666.5, 4418.3, 5209.9, 5906.989999999997, 0.7762635846127307, 48.6418285404847, 0.3850870341619867], "isController": false}, {"data": ["SearchAll-1", 560, 122, 21.785714285714285, 475743.62321428565, 230, 3637686, 277.5, 3633081.8, 3633933.45, 3634898.65, 0.15373288143186806, 0.18789973551767628, 0.02090128063608078], "isController": false}, {"data": ["Categories-0", 484, 0, 0.0, 544.6652892561983, 229, 2077, 352.0, 1198.0, 1416.0, 1996.1999999999998, 1.5216249948912384, 1.1562809964285825, 0.21695043872472733], "isController": false}, {"data": ["SearchAll-0", 560, 0, 0.0, 1823.5339285714274, 458, 9904, 799.5, 3849.8, 4063.6499999999996, 8041.47999999997, 1.727275531291447, 1.2970591013540607, 0.24964529163196694], "isController": false}, {"data": ["Login", 487, 4, 0.8213552361396304, 9755.310061601642, 713, 3631785, 2296.0, 3912.0, 4256.599999999999, 4864.56, 0.1340399191246615, 5.2497972026942294, 0.18142485612383527], "isController": false}, {"data": ["Login-0", 484, 0, 0.0, 665.1363636363636, 230, 3839, 589.5, 1094.0, 1577.75, 1984.8999999999994, 1.542359108363474, 1.0351086363346664, 1.5529025788308026], "isController": false}, {"data": ["Login-1", 484, 0, 0.0, 384.56611570247935, 229, 1372, 337.0, 623.5, 745.0, 1205.0499999999997, 1.540944879382858, 0.947283626983091, 0.24829678232243316], "isController": false}, {"data": ["Login-2", 484, 1, 0.2066115702479339, 1255.896694214876, 250, 4621, 1022.5, 2589.5, 2968.25, 4104.05, 1.5362445802941718, 58.542927859192396, 0.297930696999562], "isController": false}, {"data": ["\/Default-0", 1337, 0, 0.0, 4800.673148840678, 463, 13549, 6086.0, 9810.4, 9917.2, 13539.619999999999, 84.36395759717315, 62.38138043838339, 11.286974795715548], "isController": false}, {"data": ["\/Default", 2000, 1502, 75.1, 2183073.695000005, 2488, 3647187, 3644543.5, 3645371.9, 3645522.0, 3646803.67, 0.54831159780467, 7.5793216579345755, 0.1238587172531179], "isController": false}, {"data": ["\/Default-2", 1074, 576, 53.63128491620112, 1891218.147113595, 394, 3646048, 3633891.0, 3638827.5, 3639384.25, 3644144.75, 0.29453578527518526, 6.467531288342443, 0.026807679958896626], "isController": false}, {"data": ["\/Default-1", 1337, 263, 19.670905011219148, 277353.64472700044, 252, 3636973, 3971.0, 103367.2, 3634552.5, 3635394.54, 0.3665967564549957, 0.38918478774609894, 0.048026175851556004], "isController": false}, {"data": ["SearchAll", 821, 496, 60.41412911084044, 1485718.3641900113, 573, 3643022, 8024.0, 3637629.4, 3641138.8, 3642628.64, 0.22525086938330374, 7.413608249367254, 0.061555595947679245], "isController": false}, {"data": ["Categories-2", 481, 45, 9.355509355509355, 2898.5343035343035, 21, 312370, 1360.0, 3048.4, 4166.4, 4718.9400000000005, 0.7696221651183554, 47.573821688564635, 0.14306662031866518], "isController": false}, {"data": ["Categories-1", 484, 3, 0.6198347107438017, 478.66735537190056, 216, 2043, 278.5, 1147.0, 1807.0, 2023.9999999999995, 1.5244286542192658, 1.0965197199334795, 0.26038713873560615], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException\/Non HTTP response message: Connection reset", 348, 10.960629921259843, 2.8997583534705442], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException\/Non HTTP response message: Unrecognized Windows Sockets error: 0: recv failed", 4, 0.12598425196850394, 0.03333055578701775], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException\/Non HTTP response message: Socket closed", 2299, 72.40944881889764, 19.156736938588452], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketTimeoutException\/Non HTTP response message: Read timed out", 524, 16.503937007874015, 4.366302808099325], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 12001, 3175, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Socket closed", 2299, "Non HTTP response code: java.net.SocketTimeoutException\/Non HTTP response message: Read timed out", 524, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Connection reset", 348, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Unrecognized Windows Sockets error: 0: recv failed", 4, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["SearchAll-2", 438, 113, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Socket closed", 58, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Connection reset", 52, "Non HTTP response code: java.net.SocketTimeoutException\/Non HTTP response message: Read timed out", 3, null, null, null, null], "isController": false}, {"data": ["Categories", 486, 50, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Connection reset", 48, "Non HTTP response code: java.net.SocketTimeoutException\/Non HTTP response message: Read timed out", 2, null, null, null, null, null, null], "isController": false}, {"data": ["SearchAll-1", 560, 122, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Socket closed", 73, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Connection reset", 44, "Non HTTP response code: java.net.SocketTimeoutException\/Non HTTP response message: Read timed out", 5, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Login", 487, 4, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Connection reset", 3, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Socket closed", 1, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-2", 484, 1, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Connection reset", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["\/Default", 2000, 1502, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Socket closed", 1179, "Non HTTP response code: java.net.SocketTimeoutException\/Non HTTP response message: Read timed out", 313, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Connection reset", 9, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Unrecognized Windows Sockets error: 0: recv failed", 1, null, null], "isController": false}, {"data": ["\/Default-2", 1074, 576, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Socket closed", 557, "Non HTTP response code: java.net.SocketTimeoutException\/Non HTTP response message: Read timed out", 10, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Connection reset", 9, null, null, null, null], "isController": false}, {"data": ["\/Default-1", 1337, 263, "Non HTTP response code: java.net.SocketTimeoutException\/Non HTTP response message: Read timed out", 165, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Socket closed", 97, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Unrecognized Windows Sockets error: 0: recv failed", 1, null, null, null, null], "isController": false}, {"data": ["SearchAll", 821, 496, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Socket closed", 334, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Connection reset", 136, "Non HTTP response code: java.net.SocketTimeoutException\/Non HTTP response message: Read timed out", 24, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Unrecognized Windows Sockets error: 0: recv failed", 2, null, null], "isController": false}, {"data": ["Categories-2", 481, 45, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Connection reset", 43, "Non HTTP response code: java.net.SocketTimeoutException\/Non HTTP response message: Read timed out", 2, null, null, null, null, null, null], "isController": false}, {"data": ["Categories-1", 484, 3, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Connection reset", 3, null, null, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
