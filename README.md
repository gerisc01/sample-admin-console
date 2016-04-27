# sample-admin-console

A simple admin console created using jquery, php, and bootstrap. Allows creating, editing, and viewing users.

# Table Configuration - HOW TO (*.spec files)

Fields Values
- name (required) ==> the name of the field
- type (required) ==> the type of the field 
    - string
    - sensitive (same as string, but field is ommitted when object is returned)
    - int
    - int(bottom_of_range,top_of_range) [ie. int(0,4) for an integer between 0 and 4, inclusive]
    - menu
- display (optional) ==> If you don't like the generated display name (name with the first letter capitalized), 
    you can set an explicit display name
- dependsOn (optional) ==> If you want the possible values to change based on the value of a different field
    - Needs the *name* of the field that will be depended upon
- values (optional)
    - If the type is *menu*, a list of the values do be included in the menu
        - ie. {"values" : ["value1","value2"]}
    - If the type is *menu* and it includes a *dependsOn* field, the values will list the dependencies that the menu will depend upon
        - Each value needs to be a list of strings
        - *values* should be a key-value pair in the form of {"dependsOnValue" : ["value1","value2"]}
        - You can include sets for multiple dependsOn values by putting the key inside double curly braces {{ }}
            - For a range of integers from 1 to 5, the key-value would be {{int(1,5)}} : ["value1","value2"]
            - For a list of possible string values, the key-value would be {{['key1','key1']}} : ["value1","value2"]
        - You can use double curly braces to combine sets for a certain value
            - ie. For {{int(1,3)}} : ["value1","value2"] and {{int(3,5)}} : ["value3","value4"] the final value list for
                a dependsOnValue would be "3" : ["value1","value2","value3","value4"]