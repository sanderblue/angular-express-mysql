exports.log = function(string, data) {

    if (!string && !data) {
        console.error('System log requires at least one argument.');
    }

    if (!data) {
    
        console.log("\n" + string + "\n");
    
    } else {
    
        if (data instanceof Array) {
            console.log(
                '\n' + string, 
                '\n' + JSON.stringify(data),
                '\n'
            );
        } else {
            console.log('\n' + string + data + '\n');
        }
    
    }
}