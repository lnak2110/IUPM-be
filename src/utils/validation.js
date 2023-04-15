const yup = require('yup');
const { parse, isDate } = require('date-fns');
const { failCode } = require('./response');

// Yup test unique array elements
yup.addMethod(yup.array, 'unique', function (message, mapper = (a) => a) {
  return this.test('unique', message, function (list) {
    return list.length === new Set(list.map(mapper)).size;
  });
});

const registerSchema = yup.object({
  body: yup.object({
    name: yup.string().trim().required(),
    email: yup.string().trim().email().required(),
    password: yup.string().trim().min(4).max(10).required(),
  }),
});

const loginSchema = yup.object({
  body: yup.object({
    email: yup.string().trim().email().required(),
    password: yup.string().trim().min(4).max(10).required(),
  }),
});

const projectSchema = yup.object({
  body: yup.object({
    name: yup.string().trim().required(),
    description: yup.string().trim().min(1).max(255),
    deadline: yup
      .date()
      .transform((_value, originalValue) => {
        const parsedDate = isDate(originalValue)
          ? originalValue
          : parse(originalValue, "yyyy-MM-dd'T'HH:mm:ss", new Date());

        return parsedDate;
      })
      .min(new Date(Date.now())),
  }),
});

const taskSchema = yup.object({
  body: yup.object({
    name: yup.string().trim().required(),
    description: yup.string().trim().min(1).max(255),
    deadline: yup
      .date()
      .transform((_value, originalValue) => {
        const parsedDate = isDate(originalValue)
          ? originalValue
          : parse(originalValue, "yyyy-MM-dd'T'HH:mm:ss", new Date());

        return parsedDate;
      })
      .min(new Date(Date.now())),
    listId: yup.number().integer().oneOf([1, 2, 3, 4]).required(),
    listProjectId: yup.string().trim().uuid().required(),
    taskMembers: yup
      .array()
      .of(yup.string().trim().uuid())
      .unique('Duplicated members!', (a) => a)
      .required(),
  }),
});

const updateTaskSchema = yup.object({
  body: yup.object({
    name: yup.string().trim().required(),
    description: yup.string().trim().min(1).max(255),
    deadline: yup
      .date()
      .transform((_value, originalValue) => {
        const parsedDate = isDate(originalValue)
          ? originalValue
          : parse(originalValue, "yyyy-MM-dd'T'HH:mm:ss", new Date());

        return parsedDate;
      })
      .min(new Date(Date.now())),
    listId: yup.number().integer().oneOf([1, 2, 3, 4]).required(),
    taskMembers: yup
      .array()
      .of(yup.string().trim().uuid())
      .unique('Duplicated members!', (a) => a)
      .required(),
  }),
});

const idSchema = yup.object({
  body: yup.object({
    id: yup.string().trim().uuid().required(),
  }),
});

const idsArraySchema = yup.object({
  body: yup.object({
    idsArr: yup
      .array()
      .of(yup.string().trim().uuid())
      .unique('Duplicated ids!', (a) => a)
      .required(),
  }),
});

const idParamsSchema = yup.object({
  params: yup.object({
    id: yup.string().trim().uuid().required(),
  }),
});

const validateBody = (schema) => (req, res, next) => {
  try {
    schema.validateSync({
      body: req.body,
    });

    next();
  } catch (error) {
    console.log(error);
    return failCode(res, error.message);
  }
};

const validateParams = (schema) => (req, res, next) => {
  try {
    schema.validateSync({
      params: req.params,
    });

    next();
  } catch (error) {
    console.log(error);
    return failCode(res, error.message);
  }
};

module.exports = {
  registerSchema,
  loginSchema,
  projectSchema,
  taskSchema,
  updateTaskSchema,
  idSchema,
  idsArraySchema,
  idParamsSchema,
  validateBody,
  validateParams,
};
