import moduleB from '../ModuleB';

export const ModuleA = () => {
  console.info('Module A here.');
  console.info('Module A logging something from Module B:');
  moduleB();
}
export default ModuleA;