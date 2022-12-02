import { response } from "@dirigible/http";
import { user } from "@dirigible/security";

if (user.isInRole("Manager")) {
    response.sendRedirect("/services/v4/web/chronos-ext/ui/manager/index.html");
} else if (user.isInRole("Employee")) {
    response.sendRedirect("/services/v4/web/chronos-ext/ui/developer/index.html");
} else {
    response.sendError(response.FORBIDDEN, "Unathorized access");
}