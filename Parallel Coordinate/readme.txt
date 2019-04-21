Using D3.js to load data into HTML has a problem:
Somehow due to security and other possible reasons, web browsers prevent local files from being loaded.

To tackle this problem, we make use of a simple HTTP server that can be hosted locally using the functionality of Python:
1. Install Anaconda Navigator
2. Open Anaconda Prompt
3. Using the command cd, go to the directory where it is the root of the local web site.
   In case you want to change the drive (e.g. from C drive to D drive), simply type this command: d:
4. Type the command: python -m http.server 8888
   (8888 represents the port)
5. Open the html file using URL in the following form:
   http://localhost:8888/index.html
   (Assume we want to open index.html)


Some remarks on csv file:
To store data in the following comma-separated format, we can make use of csv files.

   name,economy (mpg),cylinders,displacement (cc),power (hp),weight (lb),0-60 mph (s),year
   AMC Ambassador Brougham,13,8,360,175,3821,11,73
   AMC Ambassador DPL,15,8,390,190,3850,8.5,70
   AMC Ambassador SST,17,8,304,150,3672,11.5,72
   AMC Concord DL 6,20.2,6,232,90,3265,18.2,79
   AMC Concord DL,18.1,6,258,120,3410,15.1,78
   AMC Concord DL,23,4,151,,3035,20.5,82
   AMC Concord,19.4,6,232,90,3210,17.2,78
   ...

1. Create a new txt file in the desired directory, and copy the comma-separated data into the file.
2. Save the file in csv format, and done.