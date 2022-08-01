function (c, a) {        
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
    //
    // TODO/GLITCH: I've seen instances where 
    // this causes script to timeout. 
    // My guess is that it is due to persistant
    // corruption on one location.
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

    return {
        repairCall: repairCall,
    }
}