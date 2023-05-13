# codbex-aion

Timesheets Management Application

## Model

![model](images/aion-model.png)

## Administrative Application

![admin](images/aion-admin.png)

## Employee Portal

![employee](images/aion-employee.png)

## Employee Fill-out Timesheet

![timesheet](images/aion-employee-timesheet.png)

## Manager Portal

![manager](images/aion-manager.png)

## Manager Generate Report

![report](images/aion-generate-report.png)

## Users & Roles

For local test & development use the following `tomcat-users.xml`:
```xml
<tomcat-users>
    <role rolename="Everyone"/>
    <role rolename="Developer"/>
    <role rolename="Operator"/>

    <role rolename="Admin"/>
    <role rolename="Manager"/>
    <role rolename="Employee"/>

    <user username="dirigible" password="dirigible" roles="Developer,Operator,Everyone,Manager,Employee,Admin"/>

    <user username="admin" password="admin" roles="Admin,Everyone"/>

    <user username="manager@codbex.com" password="manager" roles="Manager,Everyone"/>
    <user username="developer@codbex.com" password="developer" roles="Employee,Everyone"/>
    <user username="developer2@codbex.com" password="developer" roles="Employee,Everyone"/>
    <user username="developer3@codbex.com" password="developer" roles="Employee,Everyone"/>
</tomcat-users>
```

The `codbex-aion` application roles are:
- Employee
- Manager
- Admin

The `Eclipse Dirigible` roles are:
- Developer
- Operator

The `Everyone` role should be assigned to each user.
