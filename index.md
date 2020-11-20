## Covid 19 in the USA Final Report

This page is meant to serve as the final report of our team's Covid Visualization project for INLS 641. 


### Team Goals

Our team originally wanted to just visualize how the United States had been affected by the COVID-19 throughout the time since the pandemic began. However, soon after the initial proposal, we wanted to expand this visualization into highlighting racial disparities that were occuring in the healthcare system, which in turn point to a larger problem of racial disparity across the United States. 

Our project was intended to be for several audiences. The first being for general public information. We wanted to allow for people to track how covid was affecting each of their states, but also wanted there to be information for each demographic in their state as well to highlight racial discrepancies. The other audience we wanted to reach is public health officials. A visualization that highlights where racial disparities are most severe will help these officials identify where there is a higher need for nurses and doctors to focus their time and energy on. 

Ultimately for both of these groups, we wanted the visualization to get people to start thinking about this question: **Which  races are more heavily affected by Covid-19 then others and why?**

### Intended Visualization design (Ariel)

Our initial visualization design focused on a heat map of cases throughout time. This heat map would have an overarching count of the number of cases and deaths across different states. Then we would add in buttons which would change the heat map to display cases/deaths per race over time. We initially also wanted to include a sidebar to display more detailed information when the user hovered over each state. This way, they could see the exact numbers and information. We also considered adding a play button which would cause the map to automatically cycle through the dates and increment the heat map. An initial draft of our whiteboarding session is seen below. Ultimately, our group's original focus was purely on the change in cases/deaths over time per race. 

![](https://github.com/archie-sas/Covid-visualization-inls641/blob/master/pictures/aww-board%20(1).png?raw=true)
*Fig 1. Very first Whiteboarding session showing the original framework for website*

Additionally, very soon into our initial whiteboarding session, we thought that it might be beneficial to add another component which further expanded on the heatmap. This was originally planned to be some sort of graph at the bottom, potentially a bar graph. However this soon changed as we thought more about what type of visualization would best illustrate the difference across races in different states.

![](https://github.com/archie-sas/Covid-visualization-inls641/blob/master/pictures/image.png?raw=true)
*Fig 2. Second iteration of our whiteboarding session with added component for elaboration on data*

Overall, the final product varied pretty differently from our original proposal although the base project was similar. The changes made were ultimately all in order to provide more information to the user then just the heatmap, which we found was not sufficient enough for proper analysis of the data. 

### The process of the project

This project used data from The COVID Tracking Project, a volunteer organization launched from The Atlantic. The data starts on 4/12/2020 and is updated roughly every 3 days. It includes data on the 50 states as well as 6 US-affiliated territories. It is stored as an excel file, with the rows being the states on various days and the columns being the various racial breakdown data.

The data is split between cases and deaths. Cases and deaths are further split based on races. For the purpose of this project, we will focus on Whites, Blacks and Asians. The data suffers from a lot of empty values. These empty values seem more prominent in the 6 US-affiliated territories as well as various races. There is also a significant number of cases/deaths where the race is unknown. For the data cleaning process, these empty values have been replaced with “0”s due to the need of all entries to be a numerical value. There is no data entry with a genuine value of “0” so this will be an easy way to identify empty values without the code. 

A big issue in regards to the null values is that most of the  6 US-affiliated territories had no data. This made the data difficult to work with and the visualization did not communicate this well. We ultimately decided to exclude 5 of the 6 US-affiliated territories, keeping only Washington D.C due to it having sufficient data. Another big issue was that the data needed to be normalized for the visualization to make sense. The dataset does not include data on the total racial population of each state, so we needed to source them from somewhere else. After some research, we ultimately used the US Census, which included total racial population breakdown on the 50 states and Washington D.C.  A minor issue is that the date is in a weird format. 9/16/2020 is written as “20200916”. It was converted into a more standard date format. 

As the data cleaning was proceeding, the visualization frameworks were also starting to be built. The first and biggest challenge for us is to render a US map on the web page. It took us a great amount of time to successfully see a map showing up. In addition, we even branched off from the final design and it made the project more complicated than we initially imagined. To be specific, we did not look through all the data and check the data quality at the beginning. As a result, we had decided to render a United States map including all oversea territories, which were mentioned in the dataset as well. However, it increased the difficulty to render the map since the d3’s built-in projection function of the US map did not consider those oversea territories. Therefore, we had to search through the Internet for a while and finally found a Node.js module that offered the function we needed. Again, it made us hard to use on the front-end web page due to the back-end nature of the Node.js module.
 
However, after the simplified data cleaning finished, we found there was no need to render the oversea territories considering the poor data integrity. Thus, we could go back and simply use the d3’s built-in projection function but it also indicated the original efforts we made were in vain. It is possible to avoid this situation by prioritizing the data cleaning. At first glance, we thought we could divide the tasks and improve the efficiency by working on individual tasks simultaneously. But ironically it turned out to make slower progress.
 
Another big challenge for us is to handle the complex user interactions for our project. Here is a table that shows the functions that each interaction should take into consideration.
 
|                    	| Type buttons | Race buttons | Slider | Mouse click |
|------------------------|:------------:|:------------:|:------:|:-----------:|
| Update the state color |   	✓  	|   	✓  	|	✓   |         	|
| Update the color scale |   	✓  	|   	✓  	|    	|         	|
| Update the legend  	|   	✓  	|   	✓  	|    	|         	|
| Update the line chart  |   	✓  	|          	|	✓   |  	✓  	|
| Update the date string |  	        |          	|	✓   |         	|
 
In addition, there is a mouse hovering event that controls the display/hide the tooltip and updates the corresponding content in the tooltip. It is easy to recognize that many functions overlap among different interactions, which indicates data need to be shared among these interactions and even between the map and the line chart. Properly handling the data communication was difficult for us. For example, a mouse function might need the data before they can be acquired. And for some strange reasons, some variables cannot be used due to the change of variable scopes. Some problems happened during the very end stage of coding and therefore reconstructing the code structure was complicated and unrealistic. In the end, we used a global object that stored all the information that interactions needed to acquire. It is not an elegant solution for sure but at least it makes the codes work. Of course, if we have a chance to figure out the workflow of the whole system before getting our hands dirty, we might streamline the system and take less time to debug.



### End result (the prototype)

The visualization that we decided on going with in the end focused on showing covid cases and deaths with a focus on how the virus has affected different races by state over time. When loaded, our final prototype includes a heatmap with buttons that filter by race. There is a slider at the bottom of the map where the user can indicate a certain point in time or slide through to see the progression of how the virus has affected the United States as a whole or a certain state. Under the map and slider, we included a line chart in order to give the user a better understanding of the percentages instead of just the heatmap visual. Within the line chart, there is a vertical pink bar that indicates the point in time corresponding to the position of the slider. 

![](https://github.com/archie-sas/Covid-visualization-inls641/blob/master/pictures/final_overview.png?raw=true)
*Fig 3. Landing page of our project*

At the top of the heatmap, we decided to only include filters for all races, Caucasion, African American, and Asian. However, in the line chart we also included Native Hawaiin and Paicic Islanders as well as American Indian and Alaskan Natives. There was not enough data to include the NHPI and AIAN races in the heatmap for all the states, however we felt it was still important to see within the line chart. 


![](https://github.com/archie-sas/Covid-visualization-inls641/blob/master/pictures/line_chart.png?raw=true)
*Fig 4. Line chart showing the percentage of cases in each Race in Pennsylvania*

In addition to the line map, we wanted to add another tool tip on the line map that would appear when you hovered over the pink line, which would give the user a detailed percentage of each state and the percentage of cases. The percentage was calculated by taking the total number of cases or deaths and dividing it by census data in order to get the data normalized. 
![](https://github.com/archie-sas/Covid-visualization-inls641/blob/master/pictures/percentage_info.png?raw=true)
*Fig 5. Actual percentage chart*

Lastly, we changed the information bar to the right to become a tooltip that would appear with statistics when you hovered over the state. This way, the user would not have to look over to a separate bar on the right, the information would be right in front of them and the state would be highlighted in order to reinforce which state they were looking at. 

![](https://github.com/archie-sas/Covid-visualization-inls641/blob/master/pictures/map_info.png?raw=true)
*Fig 6. Tooltip that shows state statistics when hovered over*

### Ethical and Societal concerns - (Will)

One of the biggest societal concerns is how the Covid-19 virus has disproportionately affected different races and different states. The states with the highest percentages of cases are concentrated in the southern region of the USA. These state’s refusal to close down, mandate mask use and a variety of other factors seems to contribute to their high rate of cases. The states with the highest percentages of deaths are concentrated in the Tristate area. This is likely due to their status as an international hub, high population density and being among the first areas to deal with the virus. In regards to race, African Americans consistently have the highest rate of cases and deaths while Caucasian have the lowest. Asian, AIAN and NHPI usually fall between the two. This raises the concern of why Covid-19 is having a disproportionately large impact on minority races. 


From an ethical standpoint, a big concern is the data quality. The dataset starts in mid-April, when reports of underreporting Covid-19 statistics were rampant. Covid-19 related deaths are not directly classified as Covid-19 deaths and diseases such as pneumonia and influenza have very similar symptoms to Covid-19. In addition, deaths not directly caused by Covid-19 but are nonetheless related to the pandemic, are not recorded. These deaths include scenarios such as not receiving emergency care due to overcrowded hospitals, suicide from depression caused by the lock etc. Should these cases be included when studying the deaths caused by Covid-19? 


### Reflection 

The team project went through a lot of changes throughout the semester in order to get a clearer picture of the data. Throughout the process, we had to change many things about our project in order for our users to be able to answer our big question: Which races are more heavily affected by Covid-19 and why?

Now that the team has finished our prototype, we were able to reflect on what things we think would be beneficial features to add in the future, what we could have done better, and what our visualization answered about our question. The first thing we wanted to add was a more constant updated source of racial data. However, this would be difficult since racial data is not reliably getting tracked during Covid and there is not an API that tracks racial Covid data. Another feature that our team wanted to add was some feature to highlight states which had similar trends, such as states that consistently had higher “black” or “NHPI” percentages would be colored similarly so that trends were easier to notice. 

Something that we could have done better is to have expanded on the map. Since the map was not as comprehensive as we would have liked, we weren’t able to answer many questions purely based on the map. As we mentioned above, it would have been more beneficial if we had more features that highlighted trends across the map. This is because some states looked like they didn’t have many cases in a particular race on the map which wasn’t actually the case. Ultimately, however, our group was very limited in the information we presented because of the lack of comprehensive data. 

Overall, in answering our big question, our group was able to see that some races, generally Blacks and NHPI groups had a significantly higher percentage of cases within many of the states. In order to look at why, we turned to larger societal problems, which is the constant cycle of lack of education and wealth gaps within the states. Unequal access to education often limits job options that are more likely to be “Work from Home” during the pandemic. This puts many minorities at higher risk of exposure to Covid and leads to a constant cycle of poverty in these races and overall lack of proper access to the healthcare system. The connection between minorities and unequal access to education is able to explain why some races have been more heavily affected by Covid than others. We hope that our visualization is able to show both the public and officials alike that there is an unequal distribution of cases among different races and to prompt them to look into why that is the case. 

