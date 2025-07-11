
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.DepartmentScalarFieldEnum = {
  id: 'id',
  name: 'name',
  code: 'code',
  description: 'description',
  parentId: 'parentId',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  username: 'username',
  email: 'email',
  password: 'password',
  firstName: 'firstName',
  lastName: 'lastName',
  phone: 'phone',
  profileImage: 'profileImage',
  isActive: 'isActive',
  isLocked: 'isLocked',
  lastLoginAt: 'lastLoginAt',
  passwordChangedAt: 'passwordChangedAt',
  failedLoginAttempts: 'failedLoginAttempts',
  lockoutUntil: 'lockoutUntil',
  departmentId: 'departmentId',
  accessLevel: 'accessLevel',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  createdBy: 'createdBy',
  updatedBy: 'updatedBy'
};

exports.Prisma.RoleScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  level: 'level',
  isSystem: 'isSystem',
  isActive: 'isActive',
  accessLevel: 'accessLevel',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.UserRoleScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  roleId: 'roleId',
  isPrimary: 'isPrimary',
  assignedAt: 'assignedAt',
  assignedBy: 'assignedBy',
  expiresAt: 'expiresAt',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PermissionScalarFieldEnum = {
  id: 'id',
  code: 'code',
  name: 'name',
  description: 'description',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.RolePermissionScalarFieldEnum = {
  id: 'id',
  roleId: 'roleId',
  permissionId: 'permissionId',
  isGranted: 'isGranted',
  restrictions: 'restrictions',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.UserPermissionScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  permissionId: 'permissionId',
  isGranted: 'isGranted',
  reason: 'reason',
  validFrom: 'validFrom',
  validUntil: 'validUntil',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.UserSessionScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  sessionToken: 'sessionToken',
  deviceInfo: 'deviceInfo',
  ipAddress: 'ipAddress',
  location: 'location',
  isActive: 'isActive',
  lastActivityAt: 'lastActivityAt',
  expiresAt: 'expiresAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.LoginHistoryScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  status: 'status',
  ipAddress: 'ipAddress',
  deviceInfo: 'deviceInfo',
  location: 'location',
  failureReason: 'failureReason',
  createdAt: 'createdAt'
};

exports.Prisma.UserActivityLogScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  action: 'action',
  details: 'details',
  ipAddress: 'ipAddress',
  createdAt: 'createdAt'
};

exports.Prisma.LocationTypeScalarFieldEnum = {
  id: 'id',
  name: 'name',
  level: 'level',
  description: 'description',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.LocationScalarFieldEnum = {
  id: 'id',
  name: 'name',
  code: 'code',
  locationTypeId: 'locationTypeId',
  parentId: 'parentId',
  latitude: 'latitude',
  longitude: 'longitude',
  address: 'address',
  pincode: 'pincode',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ConsumerScalarFieldEnum = {
  id: 'id',
  consumerNumber: 'consumerNumber',
  name: 'name',
  email: 'email',
  primaryPhone: 'primaryPhone',
  alternatePhone: 'alternatePhone',
  idType: 'idType',
  idNumber: 'idNumber',
  connectionType: 'connectionType',
  category: 'category',
  sanctionedLoad: 'sanctionedLoad',
  connectionDate: 'connectionDate',
  locationId: 'locationId',
  billingCycle: 'billingCycle',
  billDeliveryMode: 'billDeliveryMode',
  defaultPaymentMethod: 'defaultPaymentMethod',
  creditScore: 'creditScore',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ConsumerDocumentScalarFieldEnum = {
  id: 'id',
  consumerId: 'consumerId',
  type: 'type',
  number: 'number',
  fileUrl: 'fileUrl',
  verificationStatus: 'verificationStatus',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.MeterScalarFieldEnum = {
  id: 'id',
  meterNumber: 'meterNumber',
  serialNumber: 'serialNumber',
  manufacturer: 'manufacturer',
  model: 'model',
  type: 'type',
  phase: 'phase',
  status: 'status',
  isInUse: 'isInUse',
  installationDate: 'installationDate',
  lastMaintenanceDate: 'lastMaintenanceDate',
  decommissionDate: 'decommissionDate',
  consumerId: 'consumerId',
  locationId: 'locationId',
  dtrId: 'dtrId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.MeterConfigurationScalarFieldEnum = {
  id: 'id',
  meterId: 'meterId',
  ctRatio: 'ctRatio',
  ctRatioPrimary: 'ctRatioPrimary',
  ctRatioSecondary: 'ctRatioSecondary',
  adoptedCTRatio: 'adoptedCTRatio',
  ctAccuracyClass: 'ctAccuracyClass',
  ctBurden: 'ctBurden',
  ptRatio: 'ptRatio',
  ptRatioPrimary: 'ptRatioPrimary',
  ptRatioSecondary: 'ptRatioSecondary',
  adoptedPTRatio: 'adoptedPTRatio',
  ptAccuracyClass: 'ptAccuracyClass',
  ptBurden: 'ptBurden',
  mf: 'mf',
  vmf: 'vmf',
  cmf: 'cmf',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.MeterReadingScalarFieldEnum = {
  id: 'id',
  meterId: 'meterId',
  readingDate: 'readingDate',
  readingType: 'readingType',
  readingSource: 'readingSource',
  currentReading: 'currentReading',
  previousReading: 'previousReading',
  consumption: 'consumption',
  kWh: 'kWh',
  kVAh: 'kVAh',
  kVARh: 'kVARh',
  powerFactor: 'powerFactor',
  averagePF: 'averagePF',
  minimumPF: 'minimumPF',
  voltageR: 'voltageR',
  voltageY: 'voltageY',
  voltageB: 'voltageB',
  averageVoltage: 'averageVoltage',
  currentR: 'currentR',
  currentY: 'currentY',
  currentB: 'currentB',
  averageCurrent: 'averageCurrent',
  isValid: 'isValid',
  validatedBy: 'validatedBy',
  validatedAt: 'validatedAt',
  billId: 'billId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CurrentTransformerScalarFieldEnum = {
  id: 'id',
  meterId: 'meterId',
  serialNumber: 'serialNumber',
  manufacturer: 'manufacturer',
  model: 'model',
  ratedPrimary: 'ratedPrimary',
  ratedSecondary: 'ratedSecondary',
  accuracyClass: 'accuracyClass',
  burden: 'burden',
  installationDate: 'installationDate',
  lastTestedDate: 'lastTestedDate',
  nextTestDue: 'nextTestDue',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PotentialTransformerScalarFieldEnum = {
  id: 'id',
  meterId: 'meterId',
  serialNumber: 'serialNumber',
  manufacturer: 'manufacturer',
  model: 'model',
  ratedPrimary: 'ratedPrimary',
  ratedSecondary: 'ratedSecondary',
  accuracyClass: 'accuracyClass',
  burden: 'burden',
  installationDate: 'installationDate',
  lastTestedDate: 'lastTestedDate',
  nextTestDue: 'nextTestDue',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.BillScalarFieldEnum = {
  id: 'id',
  billNumber: 'billNumber',
  meterId: 'meterId',
  consumerId: 'consumerId',
  billMonth: 'billMonth',
  billYear: 'billYear',
  fromDate: 'fromDate',
  toDate: 'toDate',
  dueDate: 'dueDate',
  previousReading: 'previousReading',
  currentReading: 'currentReading',
  unitsConsumed: 'unitsConsumed',
  fixedCharge: 'fixedCharge',
  energyCharge: 'energyCharge',
  powerFactorCharge: 'powerFactorCharge',
  otherCharges: 'otherCharges',
  subTotal: 'subTotal',
  taxes: 'taxes',
  totalAmount: 'totalAmount',
  status: 'status',
  isPaid: 'isPaid',
  paidAmount: 'paidAmount',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PaymentScalarFieldEnum = {
  id: 'id',
  transactionId: 'transactionId',
  billId: 'billId',
  amount: 'amount',
  paymentMode: 'paymentMode',
  paymentStatus: 'paymentStatus',
  gatewayResponse: 'gatewayResponse',
  receiptNumber: 'receiptNumber',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.NotificationScalarFieldEnum = {
  id: 'id',
  consumerId: 'consumerId',
  type: 'type',
  title: 'title',
  message: 'message',
  priority: 'priority',
  channels: 'channels',
  status: 'status',
  readAt: 'readAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.TicketScalarFieldEnum = {
  id: 'id',
  ticketNumber: 'ticketNumber',
  consumerId: 'consumerId',
  raisedById: 'raisedById',
  assignedToId: 'assignedToId',
  type: 'type',
  category: 'category',
  priority: 'priority',
  status: 'status',
  subject: 'subject',
  description: 'description',
  resolution: 'resolution',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.DTRScalarFieldEnum = {
  id: 'id',
  dtrNumber: 'dtrNumber',
  serialNumber: 'serialNumber',
  manufacturer: 'manufacturer',
  model: 'model',
  capacity: 'capacity',
  type: 'type',
  phase: 'phase',
  primaryVoltage: 'primaryVoltage',
  secondaryVoltage: 'secondaryVoltage',
  frequency: 'frequency',
  impedance: 'impedance',
  coolingType: 'coolingType',
  oilType: 'oilType',
  oilCapacity: 'oilCapacity',
  locationId: 'locationId',
  installationDate: 'installationDate',
  commissionDate: 'commissionDate',
  lastMaintenanceDate: 'lastMaintenanceDate',
  maxLoadLimit: 'maxLoadLimit',
  alarmThreshold: 'alarmThreshold',
  tripThreshold: 'tripThreshold',
  status: 'status',
  healthIndex: 'healthIndex',
  temperature: 'temperature',
  loadPercentage: 'loadPercentage',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.DTRReadingScalarFieldEnum = {
  id: 'id',
  dtrId: 'dtrId',
  readingDate: 'readingDate',
  readingType: 'readingType',
  loadKVA: 'loadKVA',
  loadPercentage: 'loadPercentage',
  primaryVoltage: 'primaryVoltage',
  secondaryVoltage: 'secondaryVoltage',
  primaryCurrent: 'primaryCurrent',
  secondaryCurrent: 'secondaryCurrent',
  powerFactor: 'powerFactor',
  oilTemperature: 'oilTemperature',
  windingTemperature: 'windingTemperature',
  ambientTemperature: 'ambientTemperature',
  frequency: 'frequency',
  voltageUnbalance: 'voltageUnbalance',
  currentUnbalance: 'currentUnbalance',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.DTRMaintenanceScalarFieldEnum = {
  id: 'id',
  dtrId: 'dtrId',
  maintenanceType: 'maintenanceType',
  scheduledDate: 'scheduledDate',
  completedDate: 'completedDate',
  workDone: 'workDone',
  findings: 'findings',
  recommendations: 'recommendations',
  oilDielectricTest: 'oilDielectricTest',
  oilAcidityTest: 'oilAcidityTest',
  moistureContent: 'moistureContent',
  performedBy: 'performedBy',
  verifiedBy: 'verifiedBy',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.DTRFaultScalarFieldEnum = {
  id: 'id',
  dtrId: 'dtrId',
  faultType: 'faultType',
  severity: 'severity',
  occuredAt: 'occuredAt',
  resolvedAt: 'resolvedAt',
  description: 'description',
  rootCause: 'rootCause',
  resolution: 'resolution',
  affectedMeters: 'affectedMeters',
  outageMinutes: 'outageMinutes',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.JsonNullValueInput = {
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};
exports.AccessLevel = exports.$Enums.AccessLevel = {
  RESTRICTED: 'RESTRICTED',
  NORMAL: 'NORMAL',
  ELEVATED: 'ELEVATED',
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN'
};

exports.IdType = exports.$Enums.IdType = {
  PASSPORT: 'PASSPORT',
  DRIVING_LICENSE: 'DRIVING_LICENSE',
  NATIONAL_ID: 'NATIONAL_ID',
  VOTER_ID: 'VOTER_ID',
  TAX_ID: 'TAX_ID'
};

exports.ConnectionType = exports.$Enums.ConnectionType = {
  RESIDENTIAL: 'RESIDENTIAL',
  COMMERCIAL: 'COMMERCIAL',
  INDUSTRIAL: 'INDUSTRIAL',
  AGRICULTURAL: 'AGRICULTURAL'
};

exports.ConsumerCategory = exports.$Enums.ConsumerCategory = {
  DOMESTIC: 'DOMESTIC',
  SMALL_COMMERCIAL: 'SMALL_COMMERCIAL',
  LARGE_COMMERCIAL: 'LARGE_COMMERCIAL',
  INDUSTRIAL: 'INDUSTRIAL',
  AGRICULTURAL: 'AGRICULTURAL',
  GOVERNMENT: 'GOVERNMENT'
};

exports.BillingCycle = exports.$Enums.BillingCycle = {
  MONTHLY: 'MONTHLY',
  BIMONTHLY: 'BIMONTHLY',
  QUARTERLY: 'QUARTERLY'
};

exports.PaymentMethod = exports.$Enums.PaymentMethod = {
  CASH: 'CASH',
  CHEQUE: 'CHEQUE',
  CARD: 'CARD',
  UPI: 'UPI',
  NETBANKING: 'NETBANKING',
  WALLET: 'WALLET'
};

exports.BillDeliveryMode = exports.$Enums.BillDeliveryMode = {
  EMAIL: 'EMAIL',
  SMS: 'SMS',
  WHATSAPP: 'WHATSAPP',
  PHYSICAL: 'PHYSICAL'
};

exports.DocumentType = exports.$Enums.DocumentType = {
  ID_PROOF: 'ID_PROOF',
  ADDRESS_PROOF: 'ADDRESS_PROOF',
  OWNERSHIP_PROOF: 'OWNERSHIP_PROOF',
  NOC: 'NOC',
  OTHER: 'OTHER'
};

exports.VerificationStatus = exports.$Enums.VerificationStatus = {
  PENDING: 'PENDING',
  VERIFIED: 'VERIFIED',
  REJECTED: 'REJECTED'
};

exports.MeterType = exports.$Enums.MeterType = {
  PREPAID: 'PREPAID',
  POSTPAID: 'POSTPAID'
};

exports.MeterStatus = exports.$Enums.MeterStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  FAULTY: 'FAULTY',
  DISCONNECTED: 'DISCONNECTED'
};

exports.ReadingType = exports.$Enums.ReadingType = {
  REGULAR: 'REGULAR',
  SPECIAL: 'SPECIAL',
  PROVISIONAL: 'PROVISIONAL',
  FINAL: 'FINAL'
};

exports.ReadingSource = exports.$Enums.ReadingSource = {
  AMR: 'AMR',
  MANUAL: 'MANUAL',
  MOBILE_APP: 'MOBILE_APP',
  ESTIMATED: 'ESTIMATED'
};

exports.BillStatus = exports.$Enums.BillStatus = {
  GENERATED: 'GENERATED',
  VERIFIED: 'VERIFIED',
  APPROVED: 'APPROVED',
  DISPUTED: 'DISPUTED',
  CANCELLED: 'CANCELLED'
};

exports.PaymentStatus = exports.$Enums.PaymentStatus = {
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED'
};

exports.NotificationType = exports.$Enums.NotificationType = {
  BILL_GENERATED: 'BILL_GENERATED',
  PAYMENT_DUE: 'PAYMENT_DUE',
  PAYMENT_RECEIVED: 'PAYMENT_RECEIVED',
  LOW_BALANCE: 'LOW_BALANCE',
  METER_DISCONNECTED: 'METER_DISCONNECTED'
};

exports.NotificationPriority = exports.$Enums.NotificationPriority = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT'
};

exports.NotificationStatus = exports.$Enums.NotificationStatus = {
  PENDING: 'PENDING',
  SENT: 'SENT',
  DELIVERED: 'DELIVERED',
  FAILED: 'FAILED'
};

exports.NotificationChannel = exports.$Enums.NotificationChannel = {
  SMS: 'SMS',
  EMAIL: 'EMAIL',
  PUSH: 'PUSH',
  WHATSAPP: 'WHATSAPP'
};

exports.TicketType = exports.$Enums.TicketType = {
  COMPLAINT: 'COMPLAINT',
  SERVICE_REQUEST: 'SERVICE_REQUEST',
  INQUIRY: 'INQUIRY'
};

exports.TicketCategory = exports.$Enums.TicketCategory = {
  BILLING: 'BILLING',
  METER: 'METER',
  CONNECTION: 'CONNECTION',
  TECHNICAL: 'TECHNICAL',
  OTHER: 'OTHER'
};

exports.TicketPriority = exports.$Enums.TicketPriority = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT'
};

exports.TicketStatus = exports.$Enums.TicketStatus = {
  OPEN: 'OPEN',
  ASSIGNED: 'ASSIGNED',
  IN_PROGRESS: 'IN_PROGRESS',
  RESOLVED: 'RESOLVED',
  CLOSED: 'CLOSED'
};

exports.DTRType = exports.$Enums.DTRType = {
  DISTRIBUTION: 'DISTRIBUTION',
  POWER: 'POWER',
  AUTO: 'AUTO',
  SPECIAL_PURPOSE: 'SPECIAL_PURPOSE'
};

exports.CoolingType = exports.$Enums.CoolingType = {
  ONAN: 'ONAN',
  ONAF: 'ONAF',
  OFAF: 'OFAF',
  ODAF: 'ODAF'
};

exports.OilType = exports.$Enums.OilType = {
  MINERAL: 'MINERAL',
  SYNTHETIC: 'SYNTHETIC',
  BIO_BASED: 'BIO_BASED',
  SILICONE: 'SILICONE'
};

exports.DTRStatus = exports.$Enums.DTRStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  MAINTENANCE: 'MAINTENANCE',
  FAULTY: 'FAULTY',
  OVERLOADED: 'OVERLOADED',
  DECOMMISSIONED: 'DECOMMISSIONED'
};

exports.DTRReadingType = exports.$Enums.DTRReadingType = {
  REGULAR: 'REGULAR',
  SPECIAL: 'SPECIAL',
  ALARM: 'ALARM',
  FAULT: 'FAULT'
};

exports.MaintenanceType = exports.$Enums.MaintenanceType = {
  ROUTINE: 'ROUTINE',
  PREVENTIVE: 'PREVENTIVE',
  CORRECTIVE: 'CORRECTIVE',
  EMERGENCY: 'EMERGENCY',
  OIL_TEST: 'OIL_TEST',
  INSPECTION: 'INSPECTION'
};

exports.MaintenanceStatus = exports.$Enums.MaintenanceStatus = {
  SCHEDULED: 'SCHEDULED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  DEFERRED: 'DEFERRED'
};

exports.FaultType = exports.$Enums.FaultType = {
  OVERLOAD: 'OVERLOAD',
  SHORT_CIRCUIT: 'SHORT_CIRCUIT',
  EARTH_FAULT: 'EARTH_FAULT',
  OIL_LEAK: 'OIL_LEAK',
  HIGH_TEMPERATURE: 'HIGH_TEMPERATURE',
  LOW_OIL: 'LOW_OIL',
  BUSHING_FAILURE: 'BUSHING_FAILURE',
  WINDING_FAILURE: 'WINDING_FAILURE',
  OTHER: 'OTHER'
};

exports.FaultSeverity = exports.$Enums.FaultSeverity = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL'
};

exports.FaultStatus = exports.$Enums.FaultStatus = {
  DETECTED: 'DETECTED',
  ANALYZING: 'ANALYZING',
  REPAIRING: 'REPAIRING',
  RESOLVED: 'RESOLVED',
  UNRESOLVED: 'UNRESOLVED'
};

exports.Prisma.ModelName = {
  Department: 'Department',
  User: 'User',
  Role: 'Role',
  UserRole: 'UserRole',
  Permission: 'Permission',
  RolePermission: 'RolePermission',
  UserPermission: 'UserPermission',
  UserSession: 'UserSession',
  LoginHistory: 'LoginHistory',
  UserActivityLog: 'UserActivityLog',
  LocationType: 'LocationType',
  Location: 'Location',
  Consumer: 'Consumer',
  ConsumerDocument: 'ConsumerDocument',
  Meter: 'Meter',
  MeterConfiguration: 'MeterConfiguration',
  MeterReading: 'MeterReading',
  CurrentTransformer: 'CurrentTransformer',
  PotentialTransformer: 'PotentialTransformer',
  Bill: 'Bill',
  Payment: 'Payment',
  Notification: 'Notification',
  Ticket: 'Ticket',
  DTR: 'DTR',
  DTRReading: 'DTRReading',
  DTRMaintenance: 'DTRMaintenance',
  DTRFault: 'DTRFault'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
