import { Request, Response, NextFunction } from "express";

/**
 * Wraps an async Express handler so a rejected promise (e.g. a Prisma error)
 * is passed to next(err) and handled by errorHandler, instead of becoming an
 * unhandled promise rejection that crashes the whole Node process.
 */
export function asyncHandler<Req extends Request = Request>(
  fn: (req: Req, res: Response, next: NextFunction) => Promise<unknown>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req as Req, res, next)).catch(next);
  };
}
