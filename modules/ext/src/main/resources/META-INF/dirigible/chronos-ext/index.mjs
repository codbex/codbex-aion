import { response } from "@dirigible/http";
import { user } from "@dirigible/security";

if (user.isInRole("Employee")) {
    response.sendRedirect("/services/v4/web/chronos-ext/ui/developer/");
} else if (user.isInRole("Manager")) {
    response.sendRedirect("/services/v4/web/chronos-ext/ui/manager/");
} else if (user.isInRole("Admin")) {
    response.sendRedirect("/services/v4/web/chronos-app/gen/");
} else {
    response.sendError(response.FORBIDDEN, "Unathorized access");
}
