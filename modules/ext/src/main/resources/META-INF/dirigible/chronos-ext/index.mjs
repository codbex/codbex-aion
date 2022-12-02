import { response } from "@dirigible/http";
import { user } from "@dirigible/security";

if (user.isInRole("Employee")) {
    response.sendRedirect("/services/v4/web/chronos-ext/ui/developer/");
} else if (user.isInRole("Manager")) {
    response.sendRedirect("/services/v4/web/chronos-ext/ui/manager/");
} else if (user.isInRole("Admin")) {
    response.sendRedirect("/services/v4/web/chronos-app/gen/");
} else if (user.isInRole("Developer") || user.isInRole("Operator")) {
    response.sendRedirect("/services/v4/web/ide/");
} else {
    response.sendError(response.FORBIDDEN, "Unathorized access");
}
