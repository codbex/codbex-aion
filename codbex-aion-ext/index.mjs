import { response } from "@dirigible/http";
import { user } from "@dirigible/security";

if (user.isInRole("Employee")) {
    response.sendRedirect("/services/v4/web/aion-ext/ui/employee/");
} else if (user.isInRole("Manager") || user.isInRole("Developer")) {
    response.sendRedirect("/services/v4/web/aion-ext/ui/manager/");
} else if (user.isInRole("Admin") || user.isInRole("Developer")) {
    response.sendRedirect("/services/v4/web/aion/gen/");
} else if (user.isInRole("Developer") || user.isInRole("Operator")) {
    response.sendRedirect("/services/v4/web/ide/");
} else {
    response.sendError(response.FORBIDDEN, "Unathorized access");
}
