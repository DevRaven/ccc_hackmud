function (c, a) {        
    // o========================================================================o
    //                               repairCall
    // o========================================================================o

    let corrupt = /`.[¡¢Á¤Ã¦§¨©ª]`/g
    
    function repair (s1, s2) {
        // Make corrupt character set 
        // determined to one character
        s1 = s1.replaceAll(corrupt, "¡")
        s2 = s2.replaceAll(corrupt, "¡")
        
        let i = 0
        while ((i = s1.indexOf("¡", 0)) != -1) 
            s1 = s1.substring(0, i) + s2[i] + s1.substring(i + 1)

        return s1
    }

    // c: callback, a: arguments to callback
    function repairCall (c, a) {
        let s = c(a), i, r
        
        // Handle string
        if (typeof s == "string")
            while (corrupt.test(s))
                s = repair(s, c(a))

        // Handle array of strings
        else if (Array.isArray(s))
            for (i in s)
                while (corrupt.test(s[i])) {
                    r = c(a)
                    s[i] = repair(s[i], r[i])
                }
       
        return s
    }

    // o========================================================================o
    //                               strProxy
    // o========================================================================o

    //@ patch string.charAt
    //@ patch string.charCodeAt
    //@ patch string.codePointAt
    //@ patch string.concat
    //@ patch string.endsWith
    //@ patch string.includes
    //@ patch string.indexOf
    //@ patch string.lastIndexOf
    //@ patch string.localeCompare
    //@ patch string.match
    //@ patch string.matchAll
    //@ patch string.normalize
    //@ patch string.padEnd
    //@ patch string.repeat
    //@ patch string.replace
    //@ patch string.replaceAll
    //@ patch string.search
    //@ patch string.slice
    //@ patch string.split
    //@ patch string.startsWith
    //@ patch string.substring
    //@ patch string.toLocaleLowerCase
    //@ patch string.toLocaleUpperCase
    //@ patch string.toLowerCase
    //@ patch string.toUpperCase
    //@ patch string.trim
    //@ patch string.trimEnd
    //@ patch string.trimStart

    let stringPatches = [...#fs.scripts.quine().matchAll(/\/\/@ patch string\.(\S+)/g)].map(m => m[1])
        
    function strProxy(str, argFilter, retFilter) {       
        function call(s, f, sym, ...a) {
            return retFilter(s, f, s[sym](...argFilter(s, f, ...a)))
        }         
        let o = {
            // Can't get Symbol.iterator literal
            [Symbol.iterator]: function () {
                return call(str, "@@iterator", Symbol.iterator, ...arguments)
            },
            // Can't assign 'toString' outside of declaration
            toString: function () {
                return call(str, "toString", "toString", ...arguments)
            },
            // Can't assign 'valueOf' outside of declaration
            valueOf: function () {
                return call(str, "valueOf", "valueOf", ...arguments)
            },
        }
        
        // Patch each function 
        stringPatches.forEach(func => {
            o[func] = function () {                                        
                return call(str, func, func, ...arguments)
            }
        })

        return o
    }

    // o========================================================================o
    //                               scrProxy
    // o========================================================================o

    function scrProxy(s, argFilter, retFilter) {
        let p = {
            name: s.name,            
        }
        p.call = function() {
            return retFilter(s.name, s.call(...argFilter(s.name, ...arguments)))
        }
        return p
    }

    // o========================================================================o
    //                           public library calls
    // o========================================================================o

    return {
        repairCall: repairCall,
        strProxy: strProxy,
        scrProxy, scrProxy,
    }
}