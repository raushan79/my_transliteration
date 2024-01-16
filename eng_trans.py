import sys
from indictrans import Transliterator
trn = Transliterator(source='hin', target='eng', build_lookup=True)

# getting word in argument
word = sys.argv[1]

# print('word: %s' % word);

# transliterate words
eng = trn.transform(word)
print(eng)



# ----------------------------------------------------------------
# this is a experimental
# hin = """कांग्रेस पार्टी अध्यक्ष सोनिया गांधी, तमिलनाडु की मुख्यमंत्री
# ... जयललिता और रिज़र्व बैंक के गवर्नर रघुराम राजन के बीच एक समानता
# ... है. ये सभी अलग-अलग कारणों से भारतीय जनता पार्टी के राज्यसभा सांसद
# ... सुब्रमण्यम स्वामी के निशाने पर हैं. उनके जयललिता और सोनिया गांधी के
# ... पीछे पड़ने का कारण कथित भ्रष्टाचार है."""


# eng = trn.transform(hin)

# print(eng)

# ----------------------------------------------------------------
