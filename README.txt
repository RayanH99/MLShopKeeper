This program is a genetic algorithm created to optimize the following simulation:

A shop keeper has 5 departments in their store and a certain amount of inventory available that must be distributed as efficiently as possible throughout
the 5 departments depending on the demand from customers. The demand for each department can be entered as a percentage at the start of the program (must 
add up to 100% total). The cost of production of the inventory item per item as well as the selling price can be added. The goal of the program is to find
the closest to optimal supply distribution based on customer demand in order to maximize profits. Having an excess or lack of product in the face of customer 
demands will lead to a loss of potential profit.

Note: For the sake of our simulation, we make the assumption that there is a maximum of 1000 inventory items and they all cost the same to produce (5$ per item)
as well as to sell (15$ per item).

The genetic algorithm uses a "breeding" system which takes 2 random "parent" objects to create a third "child" object with similar values of the parents, however
a slight random variation is added. This is repeated multiple times until a specific sample size is achieved, from which we eliminate the objects that do not 
have values close to what the program desires, leaving behind the most "successful children" behind for further breeding. By reiterating this process several 
times, we create several generations of "children" which are better than the previous (meaning they have values closer to what we desire). These new values which
are close to the value we desire will provide us with the information we need. For a more precise result, we can decrease the size of the random variation, this 
would in turn cause the program to take longer to reach a point where the user would be satisfied as it there would be only be small variations every generation.

By switching values in the program such as the cost of production, selling price, supply and demand, with real world data, we can optimize sales for more specific 
scenarios. For example, The cost of production and selling prices of inventory items can be modified to be specific per department, thus making the goal of the program 
to allocate the optimal amount of funds in each department. Although this program is far from a perfect working model, it demonstrates a working example of a simple
machine learning algorithm in one of its many applications to the real world. 


//This program aimed for the "Data for Urban Good" stream at BostonHacks 2018