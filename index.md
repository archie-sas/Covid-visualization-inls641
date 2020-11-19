## Covid 19 in the USA Final Report

This page is meant to serve as the final report of our team's Covid Visualization project for INLS 641. 


### Team Goals

Our team originally wanted to just visualize how the United States had been affected by the COVID-19 throughout the time since the pandemic began. However, soon after the initial proposal, we wanted to expand this visualization into highlighting racial disparities that were occuring in the healthcare system, which in turn point to a larger problem of racial disparity across the United States. 

Our project was intended to be for several audiences. The first being for general public information. We wanted to allow for people to track how covid was affecting each of their states, but also wanted there to be information for each demographic in their state as well to highlight racial discrepancies. The other audience we wanted to reach is public health officials. A visualization that highlights where racial disparities are most severe will help these officials identify where there is a higher need for nurses and doctors to focus their time and energy on. 

Ultimately for both of these groups, we wanted the visualization to get people to start thinking about this question: **Which  races are more heavily affected by Covid-19 then others and why?**

### Intended Visualization design (Ariel)

Our initial visualization design focused on a heat map of cases throughout time. This heat map would have an overarching count of the number of cases and deaths across different states. Then we would add in buttons which would change the heat map to display cases/deaths per race over time. We initially also wanted to include a sidebar to display more detailed information when the user hovered over each state. This way, they could see the exact numbers and information. We also considered adding a play button which would cause the map to automatically cycle through the dates and increment the heat map. An initial draft of our whiteboarding session is seen below. Ultimately, our group's original focus was purely on the change in cases/deaths over time per race. 

![](https://github.com/archie-sas/Covid-visualization-inls641/blob/master/pictures/aww-board%20(1).png?raw=true)
Fig 1. Very first Whiteboarding session showing the original framework for website

The actual design that we ended up with was similar but had some differences from the original whiteboard session, including removing and adding some features. Features that we removed from our original design included the animation portion of the heatmap. Instead we opted to have just the slider show how the map was changing since our range of dates wasn’t very long and the coloration of the map was not as extreme as we thought. In lieu of an animation, we opted to add in a line chart component which would appear when the user clicked on a state. We chose to use this instead because it made comparing the percentage of cases and deaths per state a lot clearer. In fact, even more clear then the original heat map, since we could see multiple races at a time. We were also able to add other races that were being tracked in the line chart, but unable to track in the heat map due to the lack of comprehensive data in some states. 

![](https://github.com/archie-sas/Covid-visualization-inls641/blob/master/pictures/line_chart.png?raw=true)
Fig 2. Line chart showing the percentage of cases in each Race in Pennsylvania

In addition to the line map, we wanted to add another tool tip on the line map that would appear when you hovered over the pink line, which would give the user a detailed percentage of each state and the percentage of cases. The percentage was calculated by taking the total number of cases or deaths and dividing it by census data in order to get the data normalized. 
![](https://github.com/archie-sas/Covid-visualization-inls641/blob/master/pictures/percentage_info.png?raw=true)
Fig 3. Actual percentage chart

Lastly, we changed the information bar to the right to become a tooltip that would appear with statistics when you hovered over the state. This way, the user would not have to look over to a separate bar on the right, the information would be right in front of them and the state would be highlighted in order to reinforce which state they were looking at. 

![](https://github.com/archie-sas/Covid-visualization-inls641/blob/master/pictures/map_info.png?raw=true)
Fig 4. Tooltip that shows state statistics when hovered over

Overall, the final product varied pretty differently from our original proposal although the base project was similar. The changes made were ultimately all in order to provide more information to the user then just the heatmap, which we found was not sufficient enough for proper analysis of the data. 

### The process of the project (ziyang, Will)

- data portion
- did we stick to initial plans
- were some parts harder/easier/more time consuming than expected


### End result (the prototype) - (Alec)


### Ethical and Societal concerns - (Will)


### Reflection 

The team project went through a lot of changes throughout the semester in order to get a clearer picture of the data. Throughout the process, we had to change many things about our project in order for our users to be able to answer our big question: Which races are more heavily affected by Covid-19 and why?

Now that the team has finished our prototype, we were able to reflect on what things we think would be beneficial features to add in the future, what we could have done better, and what our visualization answered about our question. The first thing we wanted to add was a more constant updated source of racial data. However, this would be difficult since racial data is not reliably getting tracked during Covid and there is not an API that tracks racial Covid data. Another feature that our team wanted to add was some feature to highlight states which had similar trends, such as states that consistently had higher “black” or “NHPI” percentages would be colored similarly so that trends were easier to notice. 

Something that we could have done better is to have expanded on the map. Since the map was not as comprehensive as we would have liked, we weren’t able to answer many questions purely based on the map. As we mentioned above, it would have been more beneficial if we had more features that highlighted trends across the map. This is because some states looked like they didn’t have many cases in a particular race on the map which wasn’t actually the case. Ultimately, however, our group was very limited in the information we presented because of the lack of comprehensive data. 

Overall, in answering our big question, our group was able to see that some races, generally Blacks and NHPI groups had a significantly higher percentage of cases within many of the states. In order to look at why, we turned to larger societal problems, which is the constant cycle of lack of education and wealth gaps within the states. Unequal access to education often limits job options that are more likely to be “Work from Home” during the pandemic. This puts many minorities at higher risk of exposure to Covid and leads to a constant cycle of poverty in these races and overall lack of proper access to the healthcare system. The connection between minorities and unequal access to education is able to explain why some races have been more heavily affected by Covid than others. We hope that our visualization is able to show both the public and officials alike that there is an unequal distribution of cases among different races and to prompt them to look into why that is the case. 

