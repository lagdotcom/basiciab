5 __speed=20
10 x=__width/2 : y=__height/2
20 dx=1 : dy=1
30 while 1
40   line x,y to x+1,y+1
50   x=x+dx : y=y+dy
60   if x <= 0
70     dx = 0-dx
80   endif
90   if x >= __width
100    dx = 0-dx
110  endif
120  if y <= 0
130    dy = 0-dy
140  endif
150  if y >= __height
160    dy = 0-dy
170  endif
180 wend
