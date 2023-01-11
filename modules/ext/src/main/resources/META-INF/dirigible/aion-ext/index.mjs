import { response } from "@dirigible/http";
import { user } from "@dirigible/security";

if (user.isInRole("Employee")) {
    response.sendRedirect("/services/v4/web/aion-ext/ui/developer/");
} else if (user.isInRole("Manager")) {
    response.sendRedirect("/services/v4/web/aion-ext/ui/manager/");
} else if (user.isInRole("Admin")) {
    response.sendRedirect("/services/v4/web/aion-app/gen/");
} else if (user.isInRole("Developer") || user.isInRole("Operator")) {
    response.sendRedirect("/services/v4/web/ide/");
} else {
    response.sendError(response.FORBIDDEN, "Unathorized access");
}
