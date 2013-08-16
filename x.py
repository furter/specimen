WORDSFILE = '/usr/share/dict/words' # OS X location

# python opens the file precised up there
words = open(WORDSFILE)

# define the variable
height_x = set("aceimnorsvwxz")
height_g = set("gjpqy")

# in python "word" is one line
for word in words:
    # but each line contains a line break at the end, in a list the word "bee" will in fact have four characters "b"+"e"+"e"+"line break"
    # Python strings have the strip(), lstrip(), rstrip() methods for removing "blank" characters (space, line break) from both ends of a string.
    # If you put an argument in the brakets, you can precise what kind of element you want it to take off
    # .strip() removes from both ends .rstrip() removes trailing characters (Right-strip) lstrip() removes leading characters (Left-strip)
    word = word.rstrip()
    # if the amount of letters is bigger than 3, pass
    if len(word) > 3:
        continue
    letters = set(word[1:])
    # & means intersection: the elements common to two sets
    # if there is no elements corresponding to both sets, (the intersection is empty: == 0), pass
    if len(letters & height_x) == 0:
        continue
    # if there is no elements corresponding to both sets, (the intersection is empty: == 0), pass
    if len(letters & height_g) == 0:
        continue
    # .title() means the first letter will be a capital
    print word.title()

# now go into the file containing the script in the terminal, and write
# python x.py (press enter)
